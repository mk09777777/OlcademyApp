'use strict';

/**
 * Minimal logger to prevent noisy production logging.
 * - In dev (`__DEV__`), logs behave like console.*
 * - In production, `log` and `warn` are no-ops; `error` still logs.
 */

const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

export function log(...args) {
  if (!isDev) return;
  // eslint-disable-next-line no-console
  console.log(...args);
}

export function warn(...args) {
  if (!isDev) return;
  // eslint-disable-next-line no-console
  console.warn(...args);
}

export function error(...args) {
  // Keep errors visible in production as well.
  // eslint-disable-next-line no-console
  console.error(...args);
}
