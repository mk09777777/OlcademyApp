# Release Checklist

Use this checklist before creating a production build.

## 1) Preflight (blockers)
- Run `node scripts/release-preflight.js`
- Fix any reported `localhost` / LAN IP URLs in runtime code (`app/`, `components/`, `context/`, `hooks/`, `services/`, `config/`, `utils/`).

## 2) Environment configuration
- Confirm `API_CONFIG.BACKEND_URL` is set to the intended environment (stage/prod).
- Confirm no secrets are committed (no `.env` tracked, no API keys embedded in `app.json`, Android resources, or JS source).

## 3) Notifications expectations
- Expo Go has limitations for push notifications; validate notification flows on a development build (`expo-dev-client`) or a real store-like build.
- Confirm notification permission UI behaves correctly in Expo Go vs dev build.

## 4) Smoke test flows (manual)
- Auth: login → app loads → logout clears session and routes to login.
- Cart/checkout: add item → view cart → update qty → checkout screen loads.
- Booking: open booking list/details → basic action (cancel where applicable).
- Notifications: open notification settings/page → toggle/save → delete entry.

## 5) Build
- Run `npx expo start` and ensure no red-screen crashers during basic navigation.
- Build with EAS / local build as appropriate.
