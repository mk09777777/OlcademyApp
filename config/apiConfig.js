const backendCandidates = [
  process.env.EXPO_PUBLIC_BACKEND_URL,
  process.env.API_BASE_URL,
  process.env.BACKEND_URL,
  process.env.VITE_BACKEND_URL,
  process.env.VITE_SERVER_URL,
  process.env.VITE_API_PATH
].filter(Boolean);

const fallbackBackendUrl = 'https://project-z-backend-apis.onrender.com';

const googleKeyCandidates = [
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
  process.env.GOOGLE_MAPS_API_KEY
].filter(Boolean);

export const API_CONFIG = {
  BACKEND_URL: backendCandidates[0] ?? fallbackBackendUrl,
  GOOGLE_MAPS_API_KEY: googleKeyCandidates[0] ?? 'AIzaSyCk0OnijLJs_FxIuGR1aIp-AHLRtp2BzUE'
};