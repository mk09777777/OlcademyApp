import axios from 'axios';
import CookieManager from '@react-native-cookies/cookies';
import { API_CONFIG } from './apiConfig';

const BASE = API_CONFIG.BACKEND_URL.replace(/\/+$/, ''); 

export const api = axios.create({
  baseURL: BASE,           
  timeout: 30000,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const cookies = await CookieManager.get(BASE);
  const cookieHeader = Object.entries(cookies).map(([k, v]) => `${k}=${v.value}`).join('; ');
  if (cookieHeader) {
    config.headers = { ...(config.headers || {}), Cookie: cookieHeader };
  }
  console.log('[httpClient] baseURL:', config.baseURL, 'url:', config.url);
  return config;
});


