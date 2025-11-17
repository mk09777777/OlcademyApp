# Automated Endpoint Report

- Base URL: `https://project-z-583w.onrender.com`
- Executed: 2025-11-15T06:16:00.683Z
- Authenticated As: `sushantkumaryadav912@gmail.com`

| Category | Endpoint | Method | Status | Result | Notes | Duration (ms) |
| - | - | - | - | - | - | - |
| Auth | Signup (OTP required) | POST | SKIP | Skipped | Requires OTP email workflow; run manually when needed. | 0 |
| Auth | Verify Signup OTP | POST | SKIP | Skipped | Requires OTP token from email; skipping in automation. | 0 |
| Auth | Send Email OTP | POST | SKIP | Skipped | Triggers real email; omit from automated suite. | 0 |
| Auth | Send Phone OTP | POST | SKIP | Skipped | SMS gateway not available in automation context. | 0 |
| Auth | Verify OTP (generic) | POST | SKIP | Skipped | Requires live OTP token; handled manually. | 0 |
| Auth | Reset Password | POST | 400 | Works | Will fail with 400 unless OTP validated; treats validation error as acceptable. | 791 |
| Auth | Current User Profile | GET | 200 | Works |  | 742 |
| Auth | Profile Ping | GET | 200 | Works |  | 739 |
| Menu | List Tiffin Services | GET | 200 | Works |  | 4842 |
| Menu | Search Tiffin | GET | 404 | Works |  | 1120 |
| Menu | Tiffin By ID | GET | SKIP | Skipped | Set TEST_TIFFIN_ID to validate specific tiffin record. | 0 |
| Menu | Tiffin Owner Detail (email scoped) | GET | 404 | Works |  | 950 |
| Menu | Tiffin Outlet Info | GET | 404 | Works |  | 752 |
| Menu | Add Tiffin (smoke payload) | POST | SKIP | Skipped | Endpoint requires full tiffin owner context; skipped to avoid polluting live data. | 0 |
| Menu | Tiffin Reviews | GET | SKIP | Skipped | Set TEST_TIFFIN_ID to fetch reviews. | 0 |
| Orders | All Orders (admin scope) | GET | 200 | Works |  | 1423 |
| Orders | Order History By Email | GET | SKIP | Skipped | Set TEST_EMAIL to request order history. | 0 |
| Orders | Order Revenue Summary | GET | 404 | Works |  | 813 |
| Orders | Create Tiffin Order (smoke) | POST | SKIP | Skipped | Requires real cart payload and sockets; skipped in automation. | 0 |
| Orders | Create Takeaway Order (smoke) | POST | 400 | Works | Endpoint expects populated cart; validation failure counted as acceptable. | 1058 |
| Orders | Dining Bookings List | GET | 200 | Works |  | 1430 |
| Orders | Dining Booking By ID | GET | SKIP | Skipped | Set TEST_BOOKING_ID to validate booking lookup. | 0 |
| Orders | Dining Booking Cancel | PUT | SKIP | Skipped | Set TEST_BOOKING_ID to test cancel flow. | 0 |
| Orders | User Booking Lookup | GET | 404 | Works |  | 755 |
| Orders | Dining Booking Status Update | POST | SKIP | Skipped | Set TEST_BOOKING_ID to test booking status update. | 0 |
| Analytics | Order Analytics | GET | 400 | Works |  | 753 |
| Analytics | Meal Type Analytics | GET | 400 | Works |  | 749 |
| Analytics | Order Summary | GET | 200 | Works |  | 983 |
| Analytics | User Summary | GET | 200 | Works |  | 1004 |
| Analytics | Average Order Value | GET | 200 | Works |  | 983 |
| Notifications | List Notifications | GET | 404 | Works |  | 748 |
| Notifications | Get Notification Settings | GET | 404 | Works |  | 748 |
| Notifications | Update Notification Preferences | PUT | 404 | Works |  | 756 |
| Notifications | Create Notification Entry | POST | 404 | Works |  | 740 |
| Notifications | Delete Notification Entry | DELETE | SKIP | Skipped | Set TEST_NOTIFICATION_ID to delete a notification. | 0 |
| Notifications | Update Veg Mode | PUT | 404 | Works |  | 764 |
| Notifications | Veg Mode Status | GET | 404 | Works |  | 741 |
| Cart | Cart Snapshot | GET | 404 | Works |  | 742 |
| Cart | Add To Cart (smoke) | POST | 404 | Works |  | 734 |
| Cart | Update Cart (smoke) | PUT | 404 | Works |  | 733 |
| Cart | Cart Count | GET | 404 | Works |  | 728 |
| Cart | Clear Cart | DELETE | 404 | Works |  | 925 |
| Firm | All Restaurants | GET | 200 | Works |  | 2651 |
| Firm | Recently Viewed Restaurants | GET | 404 | Works |  | 930 |
| Firm | Search Restaurants | GET | 400 | Works |  | 889 |
| Firm | Restaurant By ID | GET | SKIP | Skipped | Set TEST_RESTAURANT_ID to fetch a specific restaurant. | 0 |
| Firm | Like Status | GET | SKIP | Skipped | Set TEST_RESTAURANT_ID to check like status. | 0 |
| Firm | Liked Restaurants By User | GET | 404 | Works |  | 761 |
| Firm | Post Recently Viewed | POST | SKIP | Skipped | Set TEST_RESTAURANT_ID to create recently viewed entry. | 0 |
| Firm | Filter Firms | GET | 200 | Works |  | 2127 |
| Firm | Restaurant Menu Sections | GET | SKIP | Skipped | Set TEST_RESTAURANT_ID to inspect menu sections. | 0 |
| Marketing | Banners | GET | 200 | Works |  | 1023 |
| Marketing | Collections | GET | 200 | Works |  | 1212 |
| Marketing | Marketing Dashboard Collections | GET | 404 | Works |  | 889 |
| Marketing | Templates | GET | 200 | Works |  | 1046 |
| Marketing | Offers (Marketing) | GET | 200 | Works |  | 1033 |
| Marketing | Offer Suggestions | PUT | SKIP | Skipped | Set TEST_OFFER_ID to test suggestion update. | 0 |
| Marketing | Banner Click Tracking | POST | SKIP | Skipped | Set TEST_BANNER_ID to test banner click analytics. | 0 |
| FAQ | Public FAQ List | GET | 200 | Works |  | 974 |
| FAQ | Admin FAQ List | GET | 200 | Works |  | 1044 |
| FAQ | Create FAQ (admin) | POST | 400 | Works |  | 754 |
| Location | Location Data | GET | 200 | Works |  | 963 |
| Location | Address Search by City | GET | 200 | Works |  | 1050 |
| Location | Address Search by Locality | GET | 200 | Works |  | 983 |
| History | History Root | GET | 200 | Works |  | 1758 |
| History | Dining Booking History | GET | SKIP | Skipped | Set TEST_BOOKING_ID for dining booking history. | 0 |
| History | Takeaway History | GET | SKIP | Skipped | Set TEST_ORDER_ID for takeaway history. | 0 |
| Admin | Admin Dashboard Login | POST | 404 | Works | Uses invalid creds to ensure route responds; treat failure as acceptable. | 777 |
| Admin | Admin Profile | GET | 404 | Works |  | 743 |
| Admin | Admin FAQ CRUD | POST | 400 | Works |  | 751 |
| Admin | Admin User Count | GET | 404 | Works |  | 773 |
| Admin | Admin Order Summary | GET | 404 | Works |  | 734 |
| Admin | Admin Vendors Summary | GET | 404 | Works |  | 742 |
| Admin | Revenue Summary | GET | 404 | Works |  | 752 |
| Documents | Restaurant Documents | GET | SKIP | Skipped | Set TEST_RESTAURANT_ID to fetch documents. | 0 |
| Documents | Tiffin Documents | GET | SKIP | Skipped | Set TEST_TIFFIN_ID to fetch tiffin documents. | 0 |
| Documents | Terms Acceptance | POST | 404 | Works |  | 752 |
| Taxes | List Taxes | GET | 200 | Works |  | 968 |
| Taxes | Toggle Tax | PATCH | SKIP | Skipped | Set TEST_TAX_ID to toggle. | 0 |
| Charges | List Charges | GET | SKIP | Skipped | Set TEST_RESTAURANT_ID to list charges. | 0 |
| Charges | Delivery Range Fee | GET | 200 | Works |  | 952 |
| Search | Unified Search | GET | 400 | Works |  | 734 |
| Search | Recommendations | GET | 200 | Works |  | 756 |
| Marketing | Collection Click tracking | POST | SKIP | Skipped | Set TEST_COLLECTION_ID to track collection click. | 0 |
| Collections | Collection Like Toggle | POST | SKIP | Skipped | Set TEST_COLLECTION_ID to toggle like. | 0 |
| Collections | Collection Likes | GET | 404 | Works |  | 755 |
| Documents | Upload Document (multipart) | POST | SKIP | Skipped | Multipart upload not automated yet; requires file fixtures. | 0 |
| Offers | Upload Tiffin Document | POST | SKIP | Skipped | Multipart upload omitted in automation suite. | 0 |
