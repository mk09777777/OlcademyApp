## ESLint Audit Summary – 22 Oct 2025

- **Command:** `npm run lint --silent`
- **Result:** 591 findings (246 errors, 345 warnings); linter exits with code 1
- **Auto-fixable:** 11 warnings via `npm run lint -- --fix`

### 1. Critical Blocking Errors
| Rule | What it means | Primary hot spots |
| --- | --- | --- |
| `no-undef` | References to symbols that are never imported/declared; blocks runtime | `app/home/Dining.jsx`, `app/home/TakeAway.jsx`, `app/screens/Checkout.jsx`, `app/screens/RestaurantDetailsScreen.jsx`, multiple cart/tiffin screens |
| `import/no-unresolved` | Module paths cannot be resolved; bundler will fail | `components/Cart.jsx` (`./CartContext`), `components/HomeHeader.jsx` (`react-native-vector-icons/*`), `app/screens/MapPicker.jsx` (`@config/apiConfig`), `app/screens/SelectLocation.jsx` |
| `react/no-unescaped-entities` & `no-dupe-keys` | JSX strings contain raw quotes or duplicate style keys leading to rendering bugs | `app/screens/TakeAway.jsx`, `app/screens/OrderSummary.jsx`, `app/screens/TermsofService.jsx`, `components/WhatYou.jsx`, `app/home/Tiffin.jsx` |
| `react-hooks/exhaustive-deps` | Hooks missing dependencies; can cause stale state or infinite loops | Nearly every home/tiffin/takeaway screen plus `components/Banner.jsx`, `components/ImageGallery.jsx` |
| Undefined style references (`styles` / `DishCard` / handlers) | Indicates incomplete refactors | `app/screens/TiffinDetailsScreen.jsx`, `components/TiffinOrderCard.jsx`, `components/TakewayCollection.jsx` |

> **Remediation order:** Resolve missing imports/definitions first, then patch unresolved modules, and finally sanitise JSX strings and duplicate keys. These fixes unblock builds and prevent runtime crashes.

### 2. Modules Requiring Immediate Attention
- **Menu & Ordering flows** (`app/home/Dining.jsx`, `app/home/TakeAway.jsx`, `app/screens/TakeAwayCart.jsx`): Undefined globals (`AsyncStorage`, `Alert`), dangling promises, and extensive hook dependency gaps. These directly affect cart and ordering UX.
- **Tiffin feature set** (`app/screens/TiffinDetailsScreen.jsx`, `components/TiffinOrderCard.jsx`, `app/home/Tiffin.jsx`): Missing `styles` object and imports cause rendering failures; numerous unescaped entities inside copy need sanitising.
- **Location tooling** (`app/screens/SelectLocation.jsx`, `app/screens/MapPicker.jsx`): Icon libraries referenced via unresolved paths; duplicate style keys and unused expressions.
- **Shared UI collections** (`components/TakewayCollection.jsx`, `components/DiningCollection.jsx`, `components/EventCollection.jsx`): Missing component references (`DishCard`, bookmark handlers) and unescaped text; likely incomplete implementations.
- **Navigation headers** (`components/HomeHeader.jsx`): Vector icon imports point to non-existent packages in Expo environment; replace with `@expo/vector-icons` equivalents.

### 3. Recurring Warning Themes
- **Unused code (`no-unused-vars`, `no-unused-imports`)** across screens/components suggests legacy or scaffolded logic; pruning improves bundle size.
- **Duplicate imports (`import/no-duplicates`)** in layout files such as `app/_layout.jsx` and `app/screens/OrderSummary.jsx`.
- **Hook hygiene**: Many `useEffect`/`useCallback` instances omit dependencies or include unnecessary ones, risking race conditions.
- **String literals in JSX**: Marketing copy contains straight quotes/apostrophes; escape them or replace with template literals.

### 4. Recommended Clean-up Plan
1. **Restore missing imports/definitions**
	- Audit each `no-undef` error; import from correct packages or define local utilities.
	- For `styles` references, recreate the StyleSheet or inline styles to prevent crashes.
2. **Fix module resolution issues**
	- Replace bare `react-native-vector-icons/*` imports with `@expo/vector-icons` wrappers.
	- Create or correct aliases for `@config/apiConfig`; ensure `babel.config.js`/`tsconfig.json` expose the alias used by ESLint.
	- Republish `components/CartContext` relative path or convert imports to `@/context/CartContext`.
3. **Sanitise JSX content**
	- Escape apostrophes/quotes in long-form copy using HTML entities or template literals.
	- Deduplicate style keys in large inline style objects (`fontFamily`, `fontSize`, etc.).
4. **Stabilise Hooks**
	- Add missing dependencies to every `useEffect`/`useCallback`, memoise callbacks with `useRef` when dependencies are intentionally omitted, and document deviations.
5. **Cleanup pass**
	- Remove unused variables/imports.
	- Run `npm run lint -- --fix` to auto-resolve formatting and simple import order issues.

### 5. Suggested Follow-up
- Embed lint execution into CI to prevent regressions (`expo lint` or `eslint .` pre-commit hook).
- Split remediation into feature-based tickets (Dining/TakeAway, Tiffin, Location, Shared Components) to parallelise work.
- Once critical errors are cleared, re-run lint to collect a fresh report and update this document.

### Appendix
- Environment variables are auto-loaded via `.env` (`API_BASE_URL`, `GOOGLE_MAPS_API_KEY`) during lint runs—verify these files exist in CI.
- Full lint output preserved in the terminal history (`npm run lint --silent`).
