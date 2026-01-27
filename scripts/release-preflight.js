'use strict';

/*
Release preflight checks (client-side).

Why this exists:
- Prevent accidental release builds that still contain `localhost` / LAN IP URLs.
- Catch accidental re-introduction of API keys or other obvious secrets.

Run:
- node scripts/release-preflight.js

Exit code:
- 0: no blockers found
- 1: blockers found
*/

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');

const RUNTIME_DIRS = [
  'app',
  'components',
  'context',
  'hooks',
  'services',
  'config',
  'utils',
  'scripts'
].map((p) => path.join(PROJECT_ROOT, p));

const TEXT_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.json', '.xml', '.md']);

const BLOCKED_PATTERNS = [
  { label: 'localhost', re: /\bhttps?:\/\/localhost\b/i },
  { label: 'loopback', re: /\bhttps?:\/\/127\.0\.0\.1\b/i },
  { label: '0.0.0.0', re: /\bhttps?:\/\/0\.0\.0\.0\b/i },
  { label: 'LAN 192.168.x.x', re: /\bhttps?:\/\/192\.168\.[0-9]{1,3}\.[0-9]{1,3}\b/i },
  { label: 'LAN 10.x.x.x', re: /\bhttps?:\/\/10\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\b/i },
  // 172.16.0.0 – 172.31.255.255
  { label: 'LAN 172.16-31.x.x', re: /\bhttps?:\/\/172\.(1[6-9]|2\d|3[0-1])\.[0-9]{1,3}\.[0-9]{1,3}\b/i }
];

const SECRET_PATTERNS = [
  { label: 'Google API key (AIza...)', re: /AIza[0-9A-Za-z\-_]{20,}/g }
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip node_modules anywhere under runtime dirs just in case.
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      files.push(...walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function isTextFile(filePath) {
  return TEXT_EXTENSIONS.has(path.extname(filePath));
}

function toRel(filePath) {
  return path.relative(PROJECT_ROOT, filePath);
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const findings = [];

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.re.test(content)) {
      findings.push({ type: 'BLOCKER', kind: 'URL', label: pattern.label });
    }
  }

  for (const pattern of SECRET_PATTERNS) {
    const matches = content.match(pattern.re);
    if (matches && matches.length) {
      findings.push({ type: 'WARN', kind: 'SECRET', label: pattern.label, count: matches.length });
    }
  }

  return findings;
}

function main() {
  const allFiles = [];
  for (const dir of RUNTIME_DIRS) {
    if (fs.existsSync(dir)) {
      allFiles.push(...walk(dir));
    }
  }

  const results = [];
  for (const filePath of allFiles) {
    if (!isTextFile(filePath)) continue;
    const findings = scanFile(filePath);
    if (findings.length) {
      results.push({ filePath, findings });
    }
  }

  const blockers = results.filter((r) => r.findings.some((f) => f.type === 'BLOCKER'));
  const warns = results.filter((r) => r.findings.some((f) => f.type === 'WARN'));

  if (blockers.length === 0 && warns.length === 0) {
    console.log('✅ Release preflight: no issues found.');
    return 0;
  }

  if (blockers.length) {
    console.error('❌ Release preflight blockers found (must fix before release):');
    for (const entry of blockers) {
      const labels = entry.findings.filter((f) => f.type === 'BLOCKER').map((f) => f.label);
      console.error(`- ${toRel(entry.filePath)}: ${[...new Set(labels)].join(', ')}`);
    }
  }

  if (warns.length) {
    console.warn('⚠️ Release preflight warnings:');
    for (const entry of warns) {
      const parts = entry.findings
        .filter((f) => f.type === 'WARN')
        .map((f) => (f.count ? `${f.label} (x${f.count})` : f.label));
      console.warn(`- ${toRel(entry.filePath)}: ${[...new Set(parts)].join(', ')}`);
    }
  }

  return blockers.length ? 1 : 0;
}

process.exitCode = main();
