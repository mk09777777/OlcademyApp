import Constants from 'expo-constants';
import axios from 'axios';
import { API_CONFIG } from './apiConfig';

const BASE = String(API_CONFIG.BACKEND_URL).replace(/\/+$/, '');

// Better Expo Go detection - check multiple conditions
const isExpoGo =
  Constants.appOwnership === 'expo' ||
  Constants.executionEnvironment === 'storeClient' ||
  !Constants.isDevice;

class ApiError extends Error {
  constructor(message, { kind, response, url, method, cause } = {}) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.response = response;
    this.url = url;
    this.method = method;
    this.cause = cause;
  }
}

const isAbortError = (err) => {
  return (
    err?.name === 'AbortError' ||
    err?.code === 'ERR_CANCELED' ||
    err?.message === 'canceled'
  );
};

export const normalizeApiError = (err) => {
  if (!err) {
    return {
      kind: 'unknown',
      message: 'Unknown error',
      status: undefined,
      data: undefined,
    };
  }

  const status = err?.response?.status;
  const data = err?.response?.data;

  if (isAbortError(err)) {
    return {
      kind: 'aborted',
      message: err?.message || 'Request aborted',
      status,
      data,
    };
  }

  // axios uses `error.code` for some network-ish failures (e.g. ECONNABORTED)
  if (err?.code === 'ECONNABORTED') {
    return {
      kind: 'timeout',
      message: err?.message || 'Request timed out',
      status,
      data,
    };
  }

  // fetch failures typically arrive as TypeError without response
  if (!err?.response && (err instanceof TypeError || err?.message?.includes('Network request failed'))) {
    return {
      kind: 'network',
      message: err?.message || 'Network request failed',
      status,
      data,
    };
  }

  if (typeof status === 'number') {
    return {
      kind: 'http',
      message: err?.message || `HTTP ${status}`,
      status,
      data,
    };
  }

  return {
    kind: 'unknown',
    message: err?.message || String(err),
    status,
    data,
  };
};

const buildUrl = (base, path, params = {}) => {
  const u = new URL(path, base);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) u.searchParams.set(k, String(v));
  });
  return u.toString();
};

const fetchJson = async (url, { method, headers, body, signal } = {}) => {
  try {
    const res = await fetch(url, {
      method,
      credentials: 'include',
      headers,
      body,
      signal,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new ApiError(`HTTP ${res.status}`, {
        kind: 'http',
        url,
        method,
        response: { status: res.status, data },
      });
    }

    return { data, status: res.status };
  } catch (cause) {
    if (cause instanceof ApiError) {
      throw cause;
    }

    if (isAbortError(cause)) {
      throw new ApiError('Request aborted', {
        kind: 'aborted',
        url,
        method,
        cause,
      });
    }

    throw new ApiError('Network request failed', {
      kind: 'network',
      url,
      method,
      cause,
    });
  }
};

/**
 * HTTP Client Abstraction
 * 
 * This module unifies the network stack for the application, handling platform-specific differences
 * between Expo Go (development) and Native builds (production/EAS).
 * 
 * Architecture:
 * - Expo Go: Uses `fetch` wrapper. Authentication relies on standard browser/OS cookie handling via `credentials: 'include'`.
 * - Native: Uses `axios` + `@react-native-cookies/cookies`. Requires manual cookie injection into headers
 *   because standard `axios` in React Native does not automatically attach cookies from the native CookieStore.
 * 
 * Usage:
 * Import `api` from this file and use `api.get`, `api.post`, etc.
 */
let api;

// Check if CookieManager is available (only in native builds)
let CookieManager = null;
if (!isExpoGo) {
  try {
    CookieManager = require("@react-native-cookies/cookies").default;
  } catch (e) {
    // CookieManager not available, fallback to fetch-based API
  }
}

if (isExpoGo || !CookieManager) {
  // Use fetch-based API for Expo Go or when CookieManager is not available
  api = {
    get: async (path, options = {}) => {
      const url = buildUrl(BASE, path, options.params);
      return fetchJson(url, {
        method: 'GET',
        headers: { Accept: 'application/json', ...(options.headers || {}) },
        signal: options.signal,
      });
    },
    post: async (path, body, options = {}) => {
      const url = buildUrl(BASE, path, options.params);
      return fetchJson(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(options.headers || {}),
        },
        body: JSON.stringify(body ?? {}),
        signal: options.signal,
      });
    },
  };
} else {
  // Use axios with CookieManager for native builds
  const client = axios.create({ baseURL: BASE, timeout: 30000, withCredentials: true });
  client.interceptors.request.use(async (config) => {
    try {
      const cookies = await CookieManager.get(BASE);
      const cookieHeader = Object.entries(cookies).map(([k, v]) => `${k}=${v.value}`).join('; ');
      if (cookieHeader) config.headers = { ...(config.headers || {}), Cookie: cookieHeader };
    } catch (e) {
      // Silently fail if cookie retrieval fails
    }
    return config;
  });
  api = client;
}

export { api };

