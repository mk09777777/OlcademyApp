# Bug Report – Endpoint & Lint Findings

**Project:** OlcademyApp  
**Date:** November 4, 2025  
**Compiled by:** GitHub Copilot (GPT-5-Codex)

---

## 1. Summary
- **API usage issues:** 117 hardcoded endpoints across 50+ files, including 5 production-breaking localhost URLs and 8 routes missing credentials.
- **Endpoint typos:** 2 instances (notably `deleteNotificatonsInfo`) causing failed network calls.
- **Lint status:** `npm run lint --silent` surfaces **591 findings** (246 errors, 345 warnings). ESLint exits with code 1.
- **Test coverage:** 74 Jest tests in `docs/COMPLETE_TESTING_SUITE.js` currently expected to fail until refactors are complete.

Severity snapshot:
| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 Critical | 15 | Localhost URLs, missing credentials, endpoint typos, auth/takeaway hardcoding |
| 🟠 High | 60+ | Remaining hardcoded endpoints in reviews, cart, address, offers, notifications |
| 🟡 Medium | 40+ | Inconsistent axios/fetch usage, absent error handling, duplicate logic |

---

## 2. Critical Issues (Must Resolve First)
1. **Localhost URLs (`hooks/useTiffinHome.js`)** – Production devices cannot reach `http://localhost:8000`; results in blank data and runtime errors.  
2. **Missing Credentials (`SettingNotifications.jsx`, `NoficationsPage.jsx`, `AuthContext.jsx`)** – Session cookies omitted, leading to unauthorised responses and stale UI.  
3. **Notification Endpoint Typo** – `deleteNotificatonsInfo` misspelling (multiple files) triggers 404s.  
4. **Auth Context Hardcoding** – `/api/user`, `/api/profile`, `/api/Logout`, `/user/profileEdit` appears in multiple code paths, making backend changes brittle.

**Impact:** Authentication, notifications, and Tiffin landing screens fail under real user conditions. Fixes unblock the majority of regressions.

---

## 3. High Priority Issues
- **TakeAway Screen (`app/home/TakeAway.jsx`)** – Seven distinct endpoints hardcoded; inconsistent request params; lacks shared helper usage.  
- **Review Modules (`app/screens/Activity.jsx`, `components/review.jsx`)** – Mixed axios/fetch patterns, missing credentials, and no centralised constants.  
- **Cart Context (`context/CartContext.jsx`)** – GET/PUT/POST paths duplicated, risking mismatch with backend updates.

**Recommended Approach:** Process files service-by-service using the mapping in `API_DOCUMENTATION.md`, confirming each change with the validator script.

---

## 4. ESLint Audit Highlights (Run 22 Oct 2025)
| Rule | Meaning | Representative Files |
|------|---------|-----------------------|
| `no-undef` | Symbols used before declaration/import | `app/home/Dining.jsx`, `app/home/TakeAway.jsx`, `app/screens/Checkout.jsx`, etc. |
| `import/no-unresolved` | Module resolution failures | `components/Cart.jsx`, `components/HomeHeader.jsx`, `app/screens/MapPicker.jsx`, `app/screens/SelectLocation.jsx` |
| `react/no-unescaped-entities`, `no-dupe-keys` | Malformed JSX strings / duplicate style keys | `app/screens/TakeAway.jsx`, `app/screens/OrderSummary.jsx`, `components/WhatYou.jsx` |
| `react-hooks/exhaustive-deps` | Missing hook dependencies | Core home/tiffin screens, `components/Banner.jsx`, `components/ImageGallery.jsx` |
| Undefined style references | Crashes due to missing StyleSheet definitions | `app/screens/TiffinDetailsScreen.jsx`, `components/TiffinOrderCard.jsx`, `components/TakewayCollection.jsx` |

**Lint remediation order:** resolve `no-undef` and import errors → fix module paths/aliases → sanitise JSX strings and duplicated keys → stabilise hook dependencies → clean unused code.

---

## 5. Modules Requiring Targeted Attention
- **Menu & Ordering Flows** – Undefined globals (`AsyncStorage`, `Alert`), dangling promises.  
- **Tiffin Feature Set** – Missing styles/imports, unescaped strings.  
- **Location Tooling** – Incorrect icon imports, duplicate style keys.  
- **Shared Collections** – Missing child components (`DishCard`), broken bookmark handlers.  
- **Navigation Headers** – Vector icon modules not compatible with Expo environment (`react-native-vector-icons/*`).

---

## 6. Verification Steps
1. Run `node docs/ISSUE_VALIDATION_SCRIPT.js` – expect zero findings after fixes.  
2. Run `npm test docs/COMPLETE_TESTING_SUITE.js` – all 74 tests must pass.  
3. Execute `npm run lint -- --fix` followed by `npm run lint` – ensure clean ESLint run to prevent CI blocks.

---

## 7. Outstanding Risks
- Partial migrations may introduce hybrid patterns (mix of constants and literals). Enforce a no-literal policy via code review or lint rule.  
- Missing credentials can masquerade as data not found; add explicit error handling to surface auth failures.  
- Large-scale refactors without tests risk regressions; rely on the provided Jest suite plus manual QA for edge cases (booking cancellation, cart updates, notification toggles).

Document updates will be tracked as migration progresses; rerun audits after each major service conversion.
