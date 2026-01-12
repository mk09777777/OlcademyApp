# Endpoint Curl Status — 2025-11-15

- Base URL: `https://project-z-583w.onrender.com`
- Command pattern: `curl -s -o /dev/null -w "%{http_code}\n" <url>`
- All requests were sent without authentication headers or cookies. Endpoints returning `401` or `404` may require user context, different HTTP methods, or additional payload.

| Category | Endpoint | Method | HTTP Code | Result | Notes |
| - | - | - | - | - | - |
| Auth | /api/user | GET | 401 | Does not work | Requires authentication |
| Auth | /api/profile | GET | 401 | Does not work | Requires authentication |
| Auth | /api/Logout | GET | 401 | Does not work | Requires authentication |
| Auth | /user/profileEdit | GET | 302 | Works | Redirects (likely to login) |
| Tiffin | /api/tiffin | GET | 200 | Works | — |
| Tiffin | /api/tiffin/search | GET | 404 | Does not work | Needs query parameters |
| Tiffin | /api/tiffins/liked | GET | 404 | Does not work | Requires authentication |
| Takeaway | /firm/get-all/restaurants | GET | 200 | Works | — |
| Takeaway | /firm/getrecently-viewed | GET | 404 | Does not work | Requires authentication |
| Takeaway | /search | GET | 400 | Does not work | Missing expected query |
| Takeaway | /firm/user/liked-restaurants | GET | 404 | Does not work | Requires authentication |
| Dining Booking | /api/bookings | GET | 200 | Works | — |
| Dining Booking | /api/bookings/create | GET | 404 | Does not work | Likely POST-only |
| Dining Booking | /api/UserBookings | GET | 404 | Does not work | Requires authentication |
| Dining Booking | /api/bookings/userId | GET | 404 | Does not work | Endpoint expects path/body |
| Cart | /cart | GET | 404 | Does not work | Likely session-protected |
| Cart | /cart/clear | GET | 404 | Does not work | Should be DELETE |
| Cart | /count | GET | 404 | Does not work | Requires auth |
| Cart | /api/create | GET | 404 | Does not work | Expected POST payload |
| Orders | /api/orders | GET | 404 | Does not work | Requires auth or payload |
| Reviews | /api/reviews | GET | 400 | Does not work | Missing required params |
| Reviews | /api/reviews/user/profile | GET | 400 | Does not work | Requires auth |
| Notifications | /api/getnotifications | GET | 404 | Does not work | Requires auth |
| Notifications | /api/getNotificationsInfo | GET | 404 | Does not work | Requires auth |
| Notifications | /api/postNotificationsInfo | GET | 404 | Does not work | Should be POST |
| Notifications | /api/putnotifications | GET | 404 | Does not work | Should be PUT |
| Address | /api/getSavedAddress | GET | 404 | Does not work | Requires auth |
| Address | /api/SaveUserAddress | GET | 404 | Does not work | Should be POST |
| Location | /api/location | GET | 200 | Works | — |
| Veg Mode | /api/getVegMode | GET | 404 | Does not work | Requires auth |
| Veg Mode | /api/updateVegMode | GET | 404 | Does not work | Should be PUT |
| Offers | /offers | GET | 200 | Works | — |
| Banners | /banners | GET | 200 | Works | — |
| Collections | /collections | GET | 200 | Works | — |
| FAQ | /api/faq | GET | 200 | Works | — |
| Recommendations | /recommend?restaurant=test | GET | 200 | Works | Sample `restaurant` query |

## Not Tested
- Endpoints requiring dynamic path parameters (e.g., `/api/tiffin/{id}`) or authenticated sessions were not exercised.
- POST/PUT/DELETE routes were only probed with simple GET requests; proper payload-based testing is still pending.

For authenticated end-to-end coverage, run `node scripts/test-endpoints.js` after installing `axios-cookiejar-support` and `tough-cookie`. The automation script reads the suite from `scripts/endpoint-config.js`, logs in with the staging credentials, iterates through the configured endpoints (skipping those that require extra fixtures), and writes a detailed report to `docs/endpoint-automation-report.md`.
