# API Documentation – Client Endpoint Reference

**Project:** OlcademyApp  
**Date:** November 4, 2025  
**Audience:** Mobile client developers integrating with the centralised REST layer

---

## 1. Usage Conventions
- **Import once per file:**
  ```javascript
  import { API_ENDPOINTS } from '@/config/api';
  import { API_CONFIG } from '@/config/apiConfig';
  ```
- **Compose URLs via helper:**
  ```javascript
  const getUrl = (endpoint) => `${API_CONFIG.BACKEND_URL}${endpoint}`;
  const response = await axios.get(getUrl(API_ENDPOINTS.AUTH.GET_USER), { withCredentials: true });
  ```
- **Always include credentials for authenticated routes** so cookies/session tokens flow correctly.
- **Dynamic endpoints** are functions (e.g. `API_ENDPOINTS.DiningBooking.GET_BY_ID(id)`), ensuring URL segments remain consistent.

---

## 2. Service Catalogue (Client-Facing)
| Service | Key Endpoints | Notes |
|---------|---------------|-------|
| **AUTH** | `GET_USER`, `GET_PROFILE`, `LOGOUT`, `EDIT_PROFILE` | Required for identity flows; all `GET` endpoints expect `withCredentials: true`. |
| **TIFFIN** | `GET_ALL`, `GET_ONE(id)`, `SEARCH`, `GET_LIKED`, `OFFERS(id)` | Remove all hardcoded localhost URLs; rely on `getUrl`. |
| **TAKEAWAY** | `GET_NEARBY`, `GET_ONE(id)`, `GET_RECENTLY_VIEWED`, `POST_RECENTLY_VIEWED`, `SEARCH`, `GET_ALL_RESTAURANTS`, `GET_LIKED_RESTAURANTS` | Screens currently mix axios/fetch—standardise on shared helper. |
| **DINING BOOKING** | `GET_ALL`, `GET_BY_ID(id)`, `CREATE`, `UPDATE(id)`, `CANCEL(id)`, `GET_USER`, `GET_BY_USERID`, `UPDATE_STATUS(id)` | Already migrated in Dining screens; treat as reference implementation. |
| **CART** | `GET`, `PUT`, `POST`, `GET_COUNT`, `CREATE_ORDER` | Ensure context uses same path strings; credentials mandatory. |
| **ORDERS** | `GET_ALL`, `CREATE`, `GET_BY_ID(id)`, `UPDATE_STATUS(id)` | Align with order history UI; prefer axios client with interceptors. |
| **REVIEWS** | `GET_ALL`, `CREATE`, `GET_USER_PROFILE`, `LIKE(id)`, `UNLIKE(id)`, `HELPFUL(id)`, `NOT_HELPFUL(id)`, `DELETE(id)` | Activity/Review screens contain most hardcoded variants. |
| **NOTIFICATIONS** | `GET`, `GET_INFO`, `POST_INFO`, `PUT`, `DELETE(id)` | Fix typo `deleteNotificatonsInfo`; include `withCredentials`. |
| **ADDRESS** | `GET_SAVED`, `PUT`, `DELETE(id)` | Address screen must import API constant instead of string literal. |
| **OFFERS & PROMOS** | `GET_ALL`, `POST`, `DELETE(id)` | Used in Offer context/banner surfaces. |
| **MISC** | `LOCATION.GET`, `VEG_MODE.GET/UPDATE`, `FAQ.GET_ALL`, `COLLECTIONS.GET_ALL` | Add imports where hooks/components reference these paths directly.

> Full backend contract remains in `docs/APIDOC.md` (verified untouched). Use it for payload schemas and server-side behaviour.

---

## 3. Implementation Pattern
1. **Import constants** (`API_ENDPOINTS`, `API_CONFIG`).
2. **Build URL** with `getUrl(endpoint)` helper to avoid string interpolation mistakes.
3. **Call HTTP client** (prefer `config/httpClient.js` for consistent interceptors).
4. **Handle errors** centrally—bubble meaningful messages to UI components.

Example refactor snippet (TakeAway screen):
```javascript
const { BACKEND_URL } = API_CONFIG;
const getUrl = (endpoint) => `${BACKEND_URL}${endpoint}`;

const loadNearby = async () => {
  const url = getUrl(API_ENDPOINTS.TAKEAWAY.GET_NEARBY);
  const { data } = await api.get(url, { params: { city, feature: 'Takeaway' }, withCredentials: true });
  setRestaurants(data?.data ?? []);
};
```

---

## 4. Migration Checklist
- [ ] Replace every `/api/...` literal with the matching `API_ENDPOINTS` key.  
- [ ] Ensure dynamic segments use helper functions (e.g. `CANCEL(id)`).  
- [ ] Remove all `http://localhost` occurrences.  
- [ ] Confirm `withCredentials: true` on protected routes (Auth, Dining, Cart, Notifications).  
- [ ] Update fetch usages to share consistent error handling/logging.  
- [ ] Re-run `node docs/ISSUE_VALIDATION_SCRIPT.js` to confirm zero findings.  
- [ ] Run `npm test docs/COMPLETE_TESTING_SUITE.js` and verify 74/74 tests pass.

---

## 5. Reference Materials
- **Canonical backend spec:** `docs/APIDOC.md` (left unchanged per request).  
- **Automated validator:** `node docs/ISSUE_VALIDATION_SCRIPT.js`.  
- **Test suite:** `npm test docs/COMPLETE_TESTING_SUITE.js`.  
- **Before/After examples:** Consolidated into migration history; use Dining Booking screens as live reference.

Adhering to this guide ensures every client module consumes the centralised endpoint catalogue, simplifying future backend changes and audits.
