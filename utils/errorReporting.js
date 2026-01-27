import { error as logError } from './logger';

const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

const MAX_STR_LEN = 300;

const truncate = (value) => {
  if (typeof value !== 'string') return value;
  if (value.length <= MAX_STR_LEN) return value;
  return `${value.slice(0, MAX_STR_LEN)}…`;
};

const redact = (value) => {
  if (typeof value !== 'string') return value;

  let out = value;

  // Emails
  out = out.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted-email]');

  // Phone-like sequences (very rough): 10-15 digits with optional separators
  out = out.replace(/\b(?:\+?\d[\s-]?){10,15}\b/g, '[redacted-phone]');

  // JWT-ish tokens: three base64url-ish segments
  out = out.replace(/\b[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, '[redacted-token]');

  return truncate(out);
};

const stripUrlQuery = (value) => {
  if (typeof value !== 'string') return value;
  try {
    const url = new URL(value);
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return value;
  }
};

const hashString = (value) => {
  // djb2-ish string hash, stable and tiny.
  const str = String(value ?? '');
  let hash = 5381;
  for (let i = 0; i < str.length; i += 1) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
  }
  // unsigned 32-bit
  return (hash >>> 0).toString(16);
};

export const normalizeErrorForLog = (err, { includeStack = false } = {}) => {
  const name = redact(err?.name || (err instanceof Error ? err.name : 'Error'));
  const message = redact(err?.message || String(err));

  // If an axios-like error.response exists, keep only status and URL-ish config.
  const status = err?.response?.status;
  const url = stripUrlQuery(err?.url || err?.config?.url || undefined);
  const method = err?.method || err?.config?.method || undefined;

  const firstStackLine = typeof err?.stack === 'string' ? err.stack.split('\n')[1]?.trim() : undefined;
  const eventId = hashString(`${name}|${message}|${firstStackLine || ''}|${status || ''}|${method || ''}`);

  const base = {
    eventId,
    name,
    message,
    status: typeof status === 'number' ? status : undefined,
    method: typeof method === 'string' ? method : undefined,
    url: typeof url === 'string' ? redact(url) : undefined,
  };

  if (!includeStack) return base;

  return {
    ...base,
    stack: typeof err?.stack === 'string' ? truncate(err.stack) : undefined,
  };
};

export const reportError = ({ domain, error, extra } = {}) => {
  // Domain tags let us correlate errors without inspecting messages.
  const safeDomain = typeof domain === 'string' ? domain : 'unknown';

  const payload = {
    domain: safeDomain,
    error: normalizeErrorForLog(error, { includeStack: isDev }),
  };

  if (extra && typeof extra === 'object') {
    // Only allow string values; redact them.
    payload.extra = Object.fromEntries(
      Object.entries(extra)
        .filter(([, v]) => typeof v === 'string' && v.length > 0)
        .slice(0, 10)
        .map(([k, v]) => [k, redact(v)])
    );
  }

  // Production: single structured line; Dev: include stack and extras.
  logError('[app-error]', payload);
};
