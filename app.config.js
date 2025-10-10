import 'dotenv/config';
import appJson from './app.json';
import { API_CONFIG } from './config/apiConfig';

export default ({ config }) => {
  const baseConfig = appJson.expo ?? {};
  const googleMapsApiKey =
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ??
    process.env.GOOGLE_MAPS_API_KEY ??
    API_CONFIG?.GOOGLE_MAPS_API_KEY ??
    '';

  const androidConfig = {
    ...(baseConfig.android ?? {}),
    ...(config?.android ?? {}),
  };

  if (googleMapsApiKey) {
    androidConfig.config = {
      ...(baseConfig.android?.config ?? {}),
      ...(config?.android?.config ?? {}),
      googleMaps: {
        apiKey: googleMapsApiKey,
      },
    };
  }

  return {
    ...baseConfig,
    ...config,
    android: androidConfig,
    extra: {
      ...(baseConfig.extra ?? {}),
      ...(config?.extra ?? {}),
      googleMapsApiKey,
      GOOGLE_MAPS_API_KEY: googleMapsApiKey,
    },
  };
};
