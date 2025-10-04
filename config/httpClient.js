// import axios from 'axios';
// import CookieManager from '@react-native-cookies/cookies';
// import { API_CONFIG } from './apiConfig';

// const BASE = API_CONFIG.BACKEND_URL.replace(/\/+$/, ''); 

// export const api = axios.create({
//   baseURL: BASE,           
//   timeout: 30000,
//   withCredentials: true,
// });

// api.interceptors.request.use(async (config) => {
//   const cookies = await CookieManager.get(BASE);
//   const cookieHeader = Object.entries(cookies).map(([k, v]) => `${k}=${v.value}`).join('; ');
//   if (cookieHeader) {
//     config.headers = { ...(config.headers || {}), Cookie: cookieHeader };
//   }
//   console.log('[httpClient] baseURL:', config.baseURL, 'url:', config.url);
//   return config;
// });




import Constants from 'expo-constants';
import axios from 'axios';
import { API_CONFIG } from './apiConfig';

const BASE = String(API_CONFIG.BACKEND_URL).replace(/\/+$/, '');
const isExpoGo = Constants.appOwnership === 'expo';
const buildUrl = (base, path, params = {}) => {
  const u = new URL(path, base);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) u.searchParams.set(k, String(v));
  });
  return u.toString();
};

let api;

if (isExpoGo) {
  api = {
    get: async (path, options = {}) => {
      const url = buildUrl(BASE, path, options.params);
      const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json', ...(options.headers || {}) },
      });
      const data = await res.json().catch(() => ({}));
      return { data, status: res.status };
    },
    post: async (path, body, options = {}) => {
      const url = buildUrl(BASE, path, options.params);
      const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...(options.headers || {}) },
        body: JSON.stringify(body ?? {}),
      });
      const data = await res.json().catch(() => ({}));
      return { data, status: res.status };
    },
  };
} else {
  const client = axios.create({ baseURL: BASE, timeout: 30000, withCredentials: true });
  client.interceptors.request.use(async (config) => {
    const { default: CookieManager } = await import('@react-native-cookies/cookies');
    const cookies = await CookieManager.get(BASE);
    const cookieHeader = Object.entries(cookies).map(([k, v]) => `${k}=${v.value}`).join('; ');
    if (cookieHeader) config.headers = { ...(config.headers || {}), Cookie: cookieHeader };
    return config;
  });
  api = client;
}
export { api };
