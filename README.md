# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

0. Configure environment

   - Copy `.env.example` to `.env`
   - Set `API_BASE_URL`
   - Set `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` (needed for map-related screens)

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Project architecture (OlcademyApp)

This repo uses Expo Router (`app/`) for file-based navigation.

High-level ownership guidelines:
- Screens/routes: `app/`
- Shared UI: `components/`
- Legacy/overlapping card components: `Card/` (avoid adding new duplicates)
- Global state: `context/`
- Reusable hooks: `hooks/`
- API/domain data access: `services/`
- Pure helpers (unit-test friendly): `utils/`

Maintainability notes and known duplicate component areas are documented in `docs/MAINTAINABILITY_AND_OWNERSHIP.md`.

## Network Layer Architecture

The application uses a unified HTTP client abstraction located in `config/httpClient.js` to handle platform-specific networking behavior:

*   **Abstraction**: All network requests should use the `api` object exported from `config/httpClient.js`.
*   **Expo Go**: Uses a `fetch` wrapper. Session cookies are handled automatically by the underlying OS network stack using `credentials: 'include'`.
*   **Native Builds**: Uses `axios` configured with an interceptor to manually inject cookies retrieved via `@react-native-cookies/cookies`. This is necessary for reliable session management in standalone native builds.

### Best Practices

1.  **Always use `api`**: Do not import `axios` or use `fetch` directly in UI components.
2.  **Parallelization**: Use `Promise.allSettled` when fetching multiple resources.
3.  **Error Handling**: Use `normalizeApiError` to consistently handle errors.
For more details, see `docs/NETWORK_LAYER.md`.
