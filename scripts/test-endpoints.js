'use strict';

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');
const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
const endpointMatrix = require('./endpoint-config');
require('dotenv').config();

const cliOverrides = process.argv.slice(2).reduce((acc, arg) => {
  if (arg.startsWith('--email=')) {
    acc.email = arg.slice('--email='.length);
  } else if (arg.startsWith('--password=')) {
    acc.password = arg.slice('--password='.length);
  }
  return acc;
}, {});

function requireValue(name, value) {
  if (!value) {
    throw new Error(
      `Missing required ${name}. Provide --${name.toLowerCase().replace(/_/g, '-')}=... or set ${name} in the environment.`
    );
  }
  return value;
}

const BASE_URL = process.env.API_BASE_URL || 'https://project-z-583w.onrender.com';
const TEST_EMAIL = requireValue('TEST_EMAIL', cliOverrides.email || process.env.TEST_EMAIL);
const TEST_PASSWORD = requireValue('TEST_PASSWORD', cliOverrides.password || process.env.TEST_PASSWORD);

const cookieJar = new CookieJar();
const http = wrapper(
  axios.create({
    baseURL: BASE_URL,
    jar: cookieJar,
    withCredentials: true,
    timeout: 30000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    validateStatus: () => true
  })
);

async function authenticate() {
  const response = await http.post('/api/login', {
    email: TEST_EMAIL,
    password: TEST_PASSWORD
  });

  if (response.status !== 200) {
    const msg = response.data?.message || 'unknown error';
    throw new Error(`Login failed (${response.status}): ${msg}`);
  }

  return response.data;
}

function resolve(value, context) {
  if (typeof value === 'function') {
    return value(context);
  }
  return value;
}

function shouldSkip(def, context) {
  if (def.skip) {
    return def.note || 'Skipped per configuration.';
  }

  if (typeof def.skipIf === 'function') {
    const outcome = def.skipIf(context);
    if (outcome && outcome.reason) {
      return outcome.reason;
    }
  }

  return null;
}

async function runRequest(def, context) {
  const skipReason = shouldSkip(def, context);
  const resolvedUrl = resolve(def.url, context);
  if (skipReason) {
    return {
      ...def,
      status: 'SKIP',
      ok: true,
      durationMs: 0,
      message: skipReason,
      resolvedUrl
    };
  }

  const requestConfig = {
    method: def.method,
    url: resolvedUrl,
    headers: def.headers || {},
    params: resolve(def.params, context),
    data: resolve(def.data, context)
  };

  if (!requestConfig.url || requestConfig.url.includes('undefined')) {
    return {
      ...def,
      status: 'SKIP',
      ok: true,
      durationMs: 0,
      message: 'URL unresolved; likely missing env placeholder.',
      resolvedUrl: requestConfig.url
    };
  }

  const start = performance.now();
  const response = await http.request(requestConfig);
  const duration = performance.now() - start;

  const expected = def.expectStatus;
  const okStatuses = Array.isArray(def.okStatuses) ? def.okStatuses : [];

  let success;
  if (typeof expected === 'number') {
    success = response.status === expected || okStatuses.includes(response.status);
  } else if (okStatuses.length > 0) {
    success = okStatuses.includes(response.status);
  } else {
    success = response.status >= 200 && response.status < 300;
  }

  const details = [];
  if (!success) {
    if (response.data?.message) details.push(response.data.message);
    if (response.data?.error) details.push(response.data.error);
    if (response.status === 404) details.push('Not found (check auth/data).');
  }

  if (def.note) {
    details.push(def.note);
  }

  return {
    ...def,
    status: response.status,
    ok: success,
    durationMs: Math.round(duration),
    message: details.join(' | '),
    resolvedUrl: requestConfig.url
  };
}

function writeReport(loginResult, results) {
  const reportPath = path.resolve(__dirname, '../docs/endpoint-automation-report.md');
  const timestamp = new Date().toISOString();
  const lines = [];

  lines.push(`# Automated Endpoint Report`);
  lines.push(`
- Base URL: \`${BASE_URL}\`
- Executed: ${timestamp}
- Authenticated As: \`${loginResult?.user?.email || TEST_EMAIL}\`
`);
  lines.push('| Category | Endpoint | Method | Status | Result | Notes | Duration (ms) |');
  lines.push('| - | - | - | - | - | - | - |');

  for (const result of results) {
    const outcome = result.status === 'SKIP' ? 'Skipped' : result.ok ? 'Works' : 'Failed';
    const note = result.message ? result.message.replace(/\|/g, '\\|') : '';
    lines.push(`| ${result.category} | ${result.name} | ${result.method} | ${result.status} | ${outcome} | ${note} | ${result.durationMs} |`);
  }

  fs.writeFileSync(reportPath, `${lines.join('\n')}
`, 'utf8');
  return reportPath;
}

(async () => {
  let loginInfo;
  try {
    console.log(`Logging in as ${TEST_EMAIL} against ${BASE_URL}`);
    loginInfo = await authenticate();
    console.log('Login successful, received session cookie.');

    const context = {
      env: process.env,
      login: loginInfo,
      baseUrl: BASE_URL,
      http
    };

    const outcomes = [];
    for (const def of endpointMatrix) {
      try {
        const result = await runRequest(def, context);
        const printableUrl = result.resolvedUrl || resolve(def.url, context) || def.url;
        console.log(`→ ${def.method} ${printableUrl}`);
        outcomes.push(result);
        console.log(`  ← ${result.status} ${result.ok ? 'OK' : 'ERR'} (${result.durationMs} ms)`);
      } catch (err) {
        const failure = {
          ...def,
          status: 'ERR',
          ok: false,
          durationMs: 0,
          message: err.message
        };
        outcomes.push(failure);
        console.error(`  ← ERR ${err.message}`);
      }
    }

    const reportPath = writeReport(loginInfo, outcomes);
    console.log(`Report written to ${reportPath}`);

  const hasFailures = outcomes.some((r) => r.status !== 'SKIP' && !r.ok);
    if (hasFailures) {
      console.warn('One or more endpoints failed. Check the report for details.');
      process.exitCode = 1;
    }
  } catch (error) {
    console.error('Automation failed:', error.message);
    process.exitCode = 1;
  } finally {
    try {
      await http.get('/api/Logout');
    } catch (_) {
      // Explicitly ignore logout errors
    }
  }
})();
