**BACKEND API ENDPOINT DOCUMENTATION**

**1\. CORE API ROUTES (/api)**

**Base Path: /api**

*   **MenuRoutes:** Customer-facing and management endpoints for menu items.
*   **OrderRoutes:** Routes for placing, tracking, and managing customer orders.
*   **AnalyticsRoutes:** General business and user analytics endpoints.
*   **CartRoute:** Endpoints for managing the customer's shopping cart.
*   **orderCustomer:** Customer-facing order details and history.
*   **HistoryRouter:** Routes for querying historical data (not logs).
*   **MarketingOverview:** High-level marketing dashboard data.
*   **adminActionRoute:** Endpoints for administrative actions.
*   **TiffinLikeuser:** Endpoints for user interaction (liking/favoriting tiffins).
*   **reviewRouter:** Routes for submitting and retrieving user reviews.
*   **outletAdditionalSettings:** Management of extra outlet-specific settings.
*   **sendAppRouter:** Routes related to app functionality/routing structure.
*   **restaurantRoutes:** General restaurant/firm listing and detail endpoints.
*   **TaxesAndChargesRoutes:** Tax/charge management (for Tiffins/Specific services).
*   **TaxAndChargesRoutes:** Tax/charge management (General/Not Tiffins).
*   **Offers:** General offer management and application endpoints.
*   **ManageStatusRoutes:** Real-time status updates and management (integrated with Socket.IO).

**Specific Core API Paths**

*   **/api/user:** userNotify (Endpoints for handling user-specific notifications.)
*   **/api/tiffin:** TiffinAnalysis (Specific analytics related to tiffin services.)

**2\. RESTAURANT DASHBOARD ROUTES (/api/\*)**

Routes specifically used by restaurant owners/vendors to manage their offerings.

*   **/api/categories:** categoryRoutes (CRUD operations for menu categories.)
*   **/api/items:** itemRoutes (CRUD operations for individual menu items.)
*   **/api/combos:** comboRoutes (CRUD operations for meal combos.)
*   **/api/offers:** offerRoutes (Managing offers specific to a single outlet.)
*   **/api/operating-hours:** operatingHoursOfferRoutes (Setting business hours and offer schedules.)
*   **/api/bookings:** bookingRoutes (Managing table or service bookings.)
*   **/api/taxes:** TaxesRoutes (Management of applicable taxes.)
*   **/api/charges:** ChargesRoutes (Management of delivery or service charges.)
*   **/api/documents:** documentRoutes (Management of business documents.)
*   **/api/terms:** termsRoutes (Management of outlet-specific terms and conditions.)

**3\. USER & AUTHENTICATION ROUTES**

Routes managing user accounts, roles, profiles, and notifications.

*   **/user:** userRoutes (Public user authentication and profile creation.)
*   **/user (Admin):** userRoutesAdmin (Admin access for user management.)
*   **/profile:** ProfleRoutes (User profile detail retrieval and update.)
*   **/notify:** notifyRoutes (User notification management.)
*   **/2fa:** TwoFARoutes (Two-factor authentication setup and verification.)

**4\. ADMIN & REVENUE ROUTES**

Routes for the main Admin Panel, system-wide operations, and financial reporting.

*   **/api/dashboard:** AdminRouterLogin (Admin dashboard login and session management.)
*   **/api/admin/faq:** faqRoutes (CRUD operations for FAQ content.)
*   **/api/admin (General):** adminRoutes (General administration panel endpoints.)
*   **/api/admin (Stats):** userStatsRoute, orderSummary, userRole (Retrieval of overall user statistics, order summary, and user role management.)
*   **/api/revenue:** Revenue (Retrieval of financial and revenue reports.)

**5\. CLAIM, FIRM & PRODUCT ROUTES**

Routes dedicated to restaurant/firm setup, claim processes, and product catalogs.

*   **/claim:** claimRoutes (Customer/Public form submission for claims.)
*   **/claim-rest:** restaurantDashboardClaimRestaurants (Management of claims from the restaurant dashboard.)
*   **/api/restaurant-claims:** restaurantClaimOwnersideRoutes (Restaurant owner's view and management of claims.)
*   **/firm:** firmRoutes (Management of firm/restaurant master data.)
*   **/products:** productRoutes (Management of products/items.)

**6\. MARKETING & SYSTEM ROUTES**

Routes for campaign management, configuration, documentation, and logging.

*   **/banners:** bannerRoutes (Marketing banner management.)
*   **/api/marketing-dashboard/collections:** collectionRoutes (Marketing campaign collection management.)
*   **/templates:** templateRoutes (Email/communication template management.)
*   **/offers (Marketing):** offerRoutesMarketing (Marketing campaign offer management.)
*   **/email:** mailRoutes (Utility for sending emails.)
*   **/logs:** historyLoggerRoute (Viewing historical actions/logs.)
*   **/settings:** settingsRoutes (General application configuration settings.)
*   **/policy:** PolicyRoutes (Management of policy documents.)
*   **/ack:** AckRoutes (Management of acknowledgment documents.)
*   **/agree:** AgreementRoutes (Management of agreement documents.)
*   **/** (Root): addressRoutes (General address related utilities.)
*   **/** (Root): createApp (General entry point or search functionality.)

1.Auth Sub Routes

1.Authentication Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | /signup | Register a new user (uses validateSignup). |
| POST | /verify | Verify user’s email or OTP during signup. |
| POST | /login | Log in an existing user. |
| GET | /logout | Log out the current authenticated user. |
| GET | /user | Get the currently authenticated user’s profile details. |
| POST | /reset-password | Reset user password. |
| GET | /profile | Returns a success message when authenticated. |

2\. OAuth Login Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /google | Initiate Google OAuth login. |
| GET | /google/callback | Handle Google OAuth callback. |
| GET | /facebook | Initiate Facebook OAuth login. |
| GET | /facebook/callback | Handle Facebook OAuth callback. |
| GET | /twitter | Initiate Twitter OAuth login. |
| GET | /twitter/callback | Handle Twitter OAuth callback. |

3\. User Settings Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /getnotifications | Fetch user’s notification settings. |
| PUT | /putnotifications | Update user’s notification preferences. |
| GET | /getVegMode | Retrieve current Veg/Non-Veg mode status. |
| PUT | /updateVegMode | Update Veg/Non-Veg mode preference. |
| Method | Endpoint | Description |
| --- | --- | --- |
| POST | /postNotificationsInfo | Add a new notification entry. |
| GET | /getNotificationsInfo | Retrieve all user notifications. |
| DELETE | /deleteNotificatonsInfo/:id | Delete a specific notification by ID. |

2.OTP SUB ROUTES

*   1.  POST - /send-phone-otp
    2.  POST - /send-email-otp
    3.  POST - /verify-otp

3\. OTP (api/OTP)

| Endpoint | Method | Description |
| --- | --- | --- |
| /send-otp | POST | Sends a six-digit One-Time Password (OTP) to the user's registered email and saves it for validation. |
| /verify-otp | POST | Validates the submitted OTP against the stored code and expiry time to complete the verification process. |

4\. app**.**use("/api/admin/faq"**,** faqRoutesAdmin)**;**

| Endpoint | Method | Description |
| --- | --- | --- |
| / | GET | Fetches all FAQs, with optional filtering by category via query parameter (?category=value). |
| / | POST | Creates a new FAQ document. Requires a question (q), answer (a), and a valid category in the request body. |
| /:id | PUT | Updates an existing FAQ. Takes the FAQ document ID as a URL parameter and updates the provided question (q) and/or answer (a). |
| /:id | DELETE | Deletes a specific FAQ document using the document ID provided in the URL parameter. |

5\. app**.**use("/api/faq"**,** faqRoutes)**;**

GET - getFaqs

POST- createFaq

6\. app**.**use("/api"**,** MenuRoutes)**;**

| Endpoint | Method | Description |
| --- | --- | --- |
| /add-tiffin | POST | Creates and registers a new Tiffin service. Requires essential details like email, phone, tiffinName, category, and address. |
| /get-tiffin/:id | GET | Fetches public Tiffin service details by its unique Mongoose ID. |
| /tiffin | GET | Fetches a list of all registered Tiffin services (public facing list). |
| /tiffin/email | GET | (Authenticated) Fetches the details of the Tiffin service owned by the authenticated user's email. |
| /tiffin/email | PUT | (Authenticated) Updates the main Tiffin service details (address, phone, operating times, etc.) using the authenticated user's email as the identifier. |
| /tiffin/outlet/info | GET | (Authenticated) Fetches basic outlet information (kitchenName, address, id) for the authenticated Tiffin owner. |
| /tiffin-Reviews/:id | GET | Aggregates and retrieves the latest reviews for a specific Tiffin service ID, with optional limit via query parameters. |
| /add-plan/email | POST | (Authenticated) Adds a new meal plan (e.g., "7-day plan") to the Tiffin service menu. |
| /edit-meal-plan/:planId/email | PUT | (Authenticated) Updates the label of an existing meal plan using the plan's ID. |
| /delete-plan/:planId/email | DELETE | (Authenticated) Deletes a specific meal plan by ID, also removing associated prices from all meal types. |
| /add-meal-type/email | POST | (Authenticated) Adds a new meal type (e.g., "Dinner Thali") to the Tiffin service menu. |
| /edit-meal-type/:mealTypeId/email | PUT | (Authenticated) Updates a meal type's details (label, description, prices) and allows re-applying specific meal plans. |
| /manage_mealdays&Flexidates/email | POST | (Authenticated) Manages menu settings, specifically the available service days (serviceDays array) and the flexible dates status (isFlexibleDates). |
| /apply-meal-plans/email | POST | (Authenticated) Applies existing meal plans (labels) to a specific meal type, using either an all or specific application mode. |
| /menu/email | GET | (Authenticated) Fetches the complete menu structure (plans, meal types, instructions) for the authenticated Tiffin owner. |
| /add-instruction/email | POST | (Authenticated) Adds a new instruction/term to the Tiffin service menu (e.g., specific delivery notes). |
| /edit-instruction/:id/email | PUT | (Authenticated) Updates an existing instruction's title and details by its ID. |
| /delete-instruction/:id/email | DELETE | (Authenticated) Deletes a specific instruction by its ID from the Tiffin service menu. |

7\. app**.**use("/api"**,** OrderRoutes)**;**

| Endpoint | Method | Description |
| --- | --- | --- |
| /saveOrders | POST | Saves a new Tiffin service order to the database. Triggers an email notification to the admin/restaurant upon successful booking. |
| /delete | DELETE | Deletes all orders currently stored in the database (likely an administrative or development endpoint). |
| /getOrdersforHistory/:email | GET | Fetches a list of orders associated with the customer's email provided in the URL parameter, typically for viewing order history. |
| /getOrders | GET | Fetches a list of all orders from the database (likely an administrative endpoint). |
| /revenue | GET | Calculates and returns the total aggregated revenue from all orders in the database. |

8\. app**.**use("/api"**,** AnalyticsRoutes)**;**

| Endpoint | Method | Description |
| --- | --- | --- |
| /order-analytics | GET | Retrieves detailed order counts and total purchase revenue, grouped by daily, weekly, or monthly intervals. Requires timeframe query parameter. |
| /mealtype-analytics | GET | Calculates the total quantity of items ordered per meal type (e.g., "Lunch Thali") for specific periods: "Today," "This Week," or "This Month." Requires timeframe query parameter. |
| /order-summary | GET | Provides a quick dashboard summary of orders and total revenue for Today, This Week, This Month, and All-Time. |
| /user-summary | GET | Calculates the total number of unique users who have placed orders by checking distinct email addresses in the Orders collection. |
| /average-order-value | GET | Calculates the Average Order Value (AOV) for Today, This Week, This Month, and All-Time based on order totals. |

9\. app**.**use("/api/user"**,** userNotify)**;**

| Endpoint | Method | Description |
| --- | --- | --- |
| /notify | GET | (Authenticated) Fetches a paginated list of all notifications for the authenticated user, sorted by descending timestamp. Supports limit and skip query parameters. |
| / | POST | (Authenticated) Creates and adds a new notification to the authenticated user's profile. Requires type and message. |
| /:id | GET | (Authenticated) Fetches the details of a single notification by its ID, ensuring it belongs to the authenticated user. |
| /:id | PUT | (Authenticated) Updates an existing notification by ID. Allows modifying fields like type, message, status, details, or read. |
| /:id/read | PUT | (Authenticated) Marks a single notification specified by ID as read (read: true). |
| /mark-all-read | PUT | (Authenticated) Marks all unread notifications belonging to the authenticated user as read in a single operation. |
| /:id | DELETE | (Authenticated) Deletes a specific notification using its ID, ensuring it belongs to the authenticated user. |

10\. app**.**use("/api"**,** TaxesAndChargesRoutes)**;**

| Endpoint | Method | Handler Name |
| --- | --- | --- |
| /add-taxes | POST | add-taxes |
| /get-taxes/email | GET | get-taxes/email |
| /update-taxes/:id/email | PUT | update-taxes/:id/email |
| /delete-taxes/:id/email | DELETE | delete-taxes/:id/email |
| /add-charges | POST | add-charges |
| /get-charges/email | GET | get-charges/email |
| /update-charges/:id/email | PUT | update-charges/:id/email |
| /delete-charges/:id/email | DELETE | delete-charges/:id/email |
| /delivery-ranges/email | GET | delivery-ranges/email |
| /delivery-ranges | POST | delivery-ranges |
| /delivery-ranges/:id | PUT | delivery-ranges/:id |
| /delivery-ranges/:id/email | DELETE | delivery-ranges/:id/email |
| /delivery-ranges/:id/email | PATCH | delivery-ranges/:id/email |
| /delivery-ranges/bulk | POST | delivery-ranges/bulk |
| /delivery-ranges/calculate/email/:distance | GET | delivery-ranges/calculate/email/:distance |

11\. app**.**use("/api"**,** TaxAndChargesRoutes)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /taxes | POST | addTax |
| /taxes/:id | PUT | updateTax |
| /taxes | GET | getTaxes |
| /taxes/:id | DELETE | deleteTax |

12\. app**.**use("/api"**,** Offers)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /mail/offers | GET | mail/offers |
| /mail/offers/admin | GET | mail/offers/admin |
| /mail/admin/accept/:id | PUT | mail/admin/accept/:id |
| /tiffin/offers/:id | GET | tiffin/offers/:id |
| /mail/offers | POST | mail/offers |
| /mail/offers/:offerId | PUT | mail/offers/:offerId |
| /mail/offers/:offerId | DELETE | mail/offers/:offerId |
| /mail/offers/update-status | PATCH | mail/offers/update-status |

13\. app**.**use("/api/tiffin"**,** TiffinAnalysis)**;**

| Endpoint | Method | Description |
| --- | --- | --- |
| /tiffins/open-now | GET | Fetches all Tiffin services that are currently open based on the server time and their stored operating hours. |
| /tiffins/filter | GET | Retrieves Tiffin services using a complex filter system. Filters include rating range, price range, category, delivery city, catering options, and sorts results by cost or rating. |
| /tiffins/by-rating | GET | Fetches Tiffin services with a rating up to the specified maximum rating (maxRating query parameter). |
| /tiffins/high-rated | GET | Fetches Tiffin services that meet or exceed a minimum rating threshold (defaults to 4.5 if not specified). |
| /order-summary | GET | (Authenticated) Provides a Tiffin-specific order summary (orders and revenue) broken down by today, this week, this month, and all-time for the owner's service. |
| /average-order-value | GET | (Authenticated) Calculates the Average Order Value (AOV) for the owner's Tiffin service across different timeframes. |
| /user-summary | GET | Fetches the total number of registered users in the system. |
| /order-analytics | GET | (Authenticated) Retrieves detailed order counts and revenue data for the Tiffin service, grouped by daily, weekly, or monthly timeframes. |
| /mealtype-analytics | GET | (Authenticated) Analyzes the sales quantity for different meal types (e.g., "Lunch Thali") within the Tiffin service over a specified timeframe. |

14\. app**.**use("/api"**,** ManageStatusRoutes(io))**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /order/:id/status | PUT | order/:id/status (Updates a single order's main status) |
| /orders/bulk-action | POST | orders/bulk-action (Handles bulk actions: Accept/Reject all, or Mark as Delivered) |
| /order/:id/sub-status | PUT | order/:id/sub-status (Updates delivery status for a specific day/subdocument) |
| /auto-rejected-orders | GET | auto-rejected-orders (Fetches orders previously rejected by the system's cron job) |
| /restore-rejected-orders | POST | restore-rejected-orders (Restores "Rejected" orders back to "Processing" status) |

15\. app**.**use("/api"**,** CartRoute)**;**

/cart – addItemToCart --POST

/cart --- fetchCart --GET

/count **–** cartLength -- GET

/cart **-** updateCart) ---PUT

16\. app**.**use("/api"**,** orderCustomer)**;**

| HTTP Method | Endpoint | Description |
| --- | --- | --- |
| POST | /create | Create a new order (Takeaway or Tiffin), emits socket notifications, sends emails, and creates logs/notifications. |
| GET | /admin/takeaway-orders | Get paginated list of takeaway orders for admin with populated items and user details. |
| GET | /offers/:userId | Fetch offers applicable to a specific user. |
| PUT | /orders/cancel/:id | Cancel an order by user, update status to user_canceled, push subStatus, and log history. |
| PUT | /res/order/:orderId | Update order status by admin/restaurant (accept, reject, etc.), pushes subStatus, sends notifications, and emails. |
| PUT | /order/:orderId | Update main order status or daily subStatus (delivery status updates) for Tiffin orders. |
| GET | /all-orders | Fetch all active orders with populated items and user details (includes multiple versions in code). |
| GET | /all-orders/:id | Fetch all active orders for a specific source entity (Firm/Tiffin) by ID. |
| GET | /takeaway/user | Fetch paginated takeaway orders for logged-in user. |

17\. app**.**use("/claim"**,** claimRoutes)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /claim-restaurant/verify | POST | verifyClaim |
| /claim-restaurant/validate-otp | POST | validateOtp |
| /claim-restaurant/document | POST | uploadClaim |

18\. app**.**use("/claim-rest"**,** restaurantDashboardClaimRestaurants)**;**

| Endpoint | Method | Description |
| --- | --- | --- |
| /restaurants/multiple-firms/:email | GET | (Authenticated) Fetches a list of all registered and completed outlets belonging to the owner specified by the :email parameter. |
| /restaurants/single-firm/:email/:id | GET | (Authenticated) Fetches the data for a single, specific restaurant outlet identified by its :id, ensuring it belongs to the owner specified by :email. |
| /editOutlet/:id | POST | Updates general details and features for a specific outlet identified by its :id. Allows updates to name, address, contact, status, manager, and handles complex logic for updating Dine In/Takeaway features. |

19\. app**.**use("/firm"**,** firmRoutes)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /user/:id/islike | GET | likedByUser |
| /user/liked-restaurants | GET | getLikedRestaurantsByUser |
| /users/:id/liked | POST | updatelikedByUser |
| /getrecently-viewed | GET | getrecently_viewedrest |
| /recently-viewed/:id | POST | recentlyviewed_rest |
| /similar | GET | getSimilarRestaurants |
| /restaurants/user-menu-text/menu-sections-items/:restaurantId | GET | getUserTextMenuSectionsWithItems |
| /addRestaurant | POST | addRestaurant |
| /addTiffin | POST | addTiffin |
| /upload-tiffin-document | POST | uploadTiffinDocument |
| /tiffinDocuments/:tiffinId | GET | getTiffinDocuments |
| /tiffinDocuments/:tiffinId/:documentType | DELETE | deleteTiffinDocument |
| /complete-tiffin-registration | POST | completeTiffinRegistration |
| /getnearbyrest | GET | getRestaurants |
| /update-restaurant-status | POST | updateRestaurantStatus |
| /getOne/:id | GET | getFirmById |
| /get-all/restaurants | GET | getAllRestaurants |
| /get/newRestaurant | GET | getNewRestaurants |
| /get/tiffins | GET | getAllTiffins |
| /get/delivery-cities | GET | getDeliveryCities |
| /restaurants/menu/:restaurantId | GET | getRestaurantMenu |
| /restaurants/menu-tabs/:restaurantId | GET | getMenuTabs |
| /restaurants/menu-sections/:restaurantId | GET | getMenuSections |
| /restaurants/menu-sections-items/:restaurantId | GET | getMenuSectionsWithItems |
| /restaurants/dashboard/menu-sections-items/:restaurantId | GET | getMenuSectionsWithItems |
| /restaurants/menu-text-user-sections-items/:restaurantId | GET | getMenuTextUserSectionsWithItems |
| /restaurants/menu-images/:restaurantId | GET | getMenuImages |
| /fav/:id | POST | addFavorite |
| /favCheck/:id | GET | checkFavorite |
| /favRemove/:id | POST | removeFavorite |
| /fav | GET | getFavoriteRestaurants |
| /restaurants/phone/:restaurantId | GET | getPhoneNumber |
| /restaurants/address/:restaurantId | GET | getAddress |
| /restaurants/instagram/:restaurantId | GET | getInstagram |
| /restaurants/additional-info/:restaurantId | GET | getAdditionalInfo |
| /restaurants/overview/:restaurantId | GET | getRestaurantOverview |
| /restaurants/ratings/:restaurantId | GET | getRestaurantRatings |
| /restaurants/filter-by-ratings | GET | getRestaurantsByRatings |
| /restaurants/faqs/:restaurantId | GET | getRestaurantFAQs |
| /restaurants/images/:restaurantId | GET | getRestaurantImages |
| /restaurants/opening-hours/:restaurantId | GET | getRestaurantOpeningHours |
| /uploads/:imageName | GET | (In-router function) |
| /:firmId | DELETE | deleteFirmById |
| /search | GET | searchFirmByName |
| /filter/num-rating | GET | filterFirmsByRating |
| /filter/offers | GET | filterFirmsWithOffers |
| /filter-by-cuisines | GET | filterFirmsByCuisines |
| /filter-by-dietary | GET | filterFirmByDietary |
| /sort-by-popularity | GET | sortFirmsByPopularity |
| /filter-firms | GET | filterFirms |
| /excel-upload | POST | excelBulkUpload |
| /test-route | GET | (In-router function) |
| /test-add-restaurant | POST | testAddRestaurant |
| /restaurants/addnewItem/:restaurantId | POST | addnewItem |
| /restaurants/addSubcategory/:restaurantId | POST | addSubcategory |
| /restaurants/addmenuTab/:restaurantId | POST | addmenuTab |
| /restaurants/updateMenuItems/:restaurantId/:itemId | PATCH | updateMenuItems |
| /restaurants/deleteItem | DELETE | deleteItem |
| /restaurants/get-reviews/:id | GET | getFirmReviewsById |
| /upload-document | POST | upload-document (In-router function calling controllers) |
| /complete-registration | POST | complete-registration (In-router function calling controllers) |

20\. app**.**use("/api/restaurant-claims"**,** restaurantClaimOwnersideRoutes)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| / | POST | createClaim |
| / | GET | getAllClaims |
| /owner/:userId/:id | GET | getRestaurantByOwnerName |
| /:id | GET | getClaimById |
| /getall-owner/:id | GET | getAllRestaurantByOwnerName |
| /get-owner-restid/:ownerId/:_id | GET | getRestaurantByOwnerNameAndByRestaurantId |
| /:id | PUT | updateClaim |
| /approve/:name | PATCH | approve |
| /:id | DELETE | deleteClaim |

21\. app**.**use("/api"**,** outletAdditionalSettings)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /outletAdditionalSettings/:id | POST | additionalOutletSettings |
| /update-restaurant-details/:id | PUT | updateRestaurantsDetails |

22\. app**.**use("/api"**,**sendAppRouter)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /send-sms | POST | (In-router function) |
| /send-app | POST | (In-router function) |

23\. app**.**use("/api"**,** restaurantRoutes)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /restaurants | GET | getAllRestaurants |
| /restaurants/:id | GET | getRestaurantById |
| /restaurants | POST | createRestaurant |
| /restaurants/:id | PUT | updateRestaurant |
| /restaurants/:id/status | PUT | changeRestaurantStatus |
| /restaurants/:id | DELETE | deleteRestaurant |

24\. app**.**use("/"**,** addressRoutes)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /api/addresses | POST | createAddresses |
| /api/addresses/:city | GET | getAddressesByCity |
| /api/addresses/locality/:locality | GET | getAddressesByLocality |
| /api/location | GET | getLocationData |

25\. app**.**use("/api"**,** HistoryRouter)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /history | GET | (In-router function) |
| /history/:id | GET | (In-router function) |
| /history/dining-booking/:id | GET | history/dining-booking/:id |
| /history/ordertakeaway/:id | GET | history/ordertakeaway/:id |
| /history/multiple-firms/:email | GET | history/multiple-firms/:email |
| /history/dining-takeaway-orders/:id | GET | history/dining-takeaway-orders/:id |

26\. app**.**use("/api"**,**MarketingOverview)**;**

| /dashboard-data | GET | (In-router function) |
| --- | --- | --- |

27\. app**.**use("/api"**,** adminActionRoute)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /Edit/:resId | PUT | Edit/:resId |
| /latest-firm | GET | latest-firm |
| /get-firm-names | GET | get-firm-names |
| /search-firm | GET | search-firm |
| /update-firm-action/:id | PUT | update-firm-action/:id |

28\. app**.**use("/user"**,** userRoutes)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /sign | POST | Sign |
| /login | POST | dashboard (For Dashboard Login) |
| /profile | GET | getMyProfile |
| /signup | POST | registerUser |
| /login | POST | loginUser (For Regular User Login) |
| /marketing | GET | marketingPerson |
| /mutli-role-filter | POST | changeMultiUserRoles |
| /change-control/:id | POST | changeSingleUserRoles |
| /ban-user/:id | PUT | toggleUserBanStatus |
| /search | GET | searchUserByNameAndEmail |
| /profileEdit | POST | profileEdit |
| /profileData | GET | profileData |
| /delete-user/:id | DELETE | deleteUser |
| /delete-user-profile | DELETE | deleteUserProfile |
| /all-user | GET | getAllUsers |
| /filter | GET | roleBasedFilter |
| /sort | GET | sortUser |
| /banned-many | PUT | bannedManyUser |
| /access-many | PUT | accessManyUser |
| /:id | PUT | editUser |
| /delete-many | DELETE | deleteManyUser |
| /:userId | GET | getUserById |
| /dashboard-login | POST | (In-router function for Dashboard Login) |

29\. app**.**use("/notify"**,** notifyRoutes)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| / | GET | (In-router function) |
| /admin | GET | (In-router function) |
| /restaurant | GET | (In-router function) |
| /tiffin | GET | (In-router function) |
| /marketing | GET | (In-router function) |
| /admins | GET | (In-router function) |
| /category/:category | DELETE | category/:category (Deletes notifications by category) |
| /oldest | GET | oldest |
| /latest | GET | latest |
| /unread | GET | unread |
| /:id | GET | /:id (Get notification by ID) |
| /:id | PUT | /:id (Mark notification as viewed) |
| /:id | DELETE | /:id (Delete notification by ID) |

30\. app**.**use("/user"**,** userRoutesAdmin)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /SignIn | POST | SignIn (Handles user login) |
| /register | POST | register (Handles new user sign-up) |

31\. app**.**use("/email"**,** mailRoutes)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /inbox | GET | inbox |
| /sent | POST | sent (Create/send mail with image upload) |
| /Sent | GET | Sent (View sent mail) |
| /star | GET | star |
| /SendStar | POST | SendStar (Star a received mail) |
| /inbox/read | POST | inbox/read (Mark mail as read) |
| /SentTrash | POST | SentTrash (Move mail to trash) |
| /isTrashed | GET | isTrashed (View trash folder) |
| /draft | POST | draft (Save mail as draft) |
| /isDraft | GET | isDraft (View drafts folder) |

32\. app**.**use("/api/dashboard"**,** AdminRouterLogin)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /sign | POST | Sign |
| /login | POST | dashboard (Handles Dashboard Login) |
| /profile | GET | getMyProfile (User profile details) |
| /das/profile | GET | getProfile (Dashboard-specific profile details) |

33\. app**.**use("/api/admin/faq"**,** faqRoutes)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| / | GET | getFaqs |
| / | POST | createFaq |

34\. app**.**use("/settings"**,** settingsRoutes)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| / | GET | (In-router function) |
| /settings | POST | settings (Updates or creates system settings) |

35\. app**.**use("/policy"**,** PolicyRoutes)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /policies/:category | GET | policies/:category |
| /policies | POST | policies (Create new policy) |
| /policies/:category | PUT | policies/:category (Update policy items by index) |
| /policies/:category | DELETE | policies/:category (Delete policy item by index) |
| /policy/add/:category | POST | policy/add/:category (Add new item to an existing policy list) |

36\. app**.**use("/ack"**,** AckRoutes)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /agreements | POST | agreements (Creates or updates an agreement) |
| /agreements/:title | GET | agreements/:title (Retrieves an agreement by title) |

37\. app**.**use("/agree"**,** AgreementRoutes)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /send-agreement | POST | send-agreement |
| /admin-accept/:id | POST | admin-accept/:id |
| /addUser | POST | addUser |
| /acknowledgments/:userId | GET | acknowledgments/:userId |
| /user-accept/:id | POST | user-accept/:id |
| /all | GET | all |

38\. app**.**use("/2fa"**,** TwoFARoutes)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /enable | POST | enable (Initiates 2FA setup and sends OTP) |
| /verify-otp | POST | verify-otp (Validates OTP to complete 2FA setup) |
| /update-location-sharing | PUT | update-location-sharing |
| /update-visibility | PUT | update-visibility |

39\. app**.**use("/profile"**,** ProfleRoutes)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /update | PUT | update (Create or update profile details) |
| /findByEmail | GET | findByEmail |

40\. app**.**use("/api"**,**TiffinLikeuser)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /tiffins/:id/like | POST | toggleLike |
| /tiffins/:id/isliked | GET | checkIfLiked |
| /tiffins/liked | GET | getLikedTiffins |

41\. app**.**use("/api"**,** reviewRouter)**; NEED TO DO**

**42\. app.use("/logs", historyLoggerRoute);**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| / | GET | getAllHistoryLog |
| /entity | GET | getEntity |
| /user-role | GET | getLogsByUserRole |
| /date-range | GET | getLogsWithInDateRange |
| /action | GET | getLogsByActions |
| /entity-action | GET | getLogsByEntityAndAction |
| /response-time | GET | getLogsByResponseTime |
| /archived | GET | getArchievedLogs |
| /search | GET | searchByName |

43\. app**.**use("/api/admin"**,** adminRoutes)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /top-restaurants | GET | top-restaurants |

44\. app**.**use("/api/admin"**,** userStatsRoute)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /user-count | GET | user-count (Aggregates user signups by daily or monthly) |
| /user-count/daily | GET | user-count/daily (Aggregates user signups over the last 7 or N days) |
| /users | GET | users (Retrieves all users with basic profile data) |

45\. app**.**use("/api/admin"**,** orderSummary)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /order-summary | GET | order-summary |

46\. app**.**use("/api/admin"**,** userRole)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /vendors | GET | vendors |
| /user-vendor-summary | GET | user-vendor-summary |

47\. app**.**use("/api/revenue"**,** Revenue)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /type | GET | type (Calculates revenue split between Tiffin and Firm item types) |
| /summary | GET | summary (Provides total revenue and daily/monthly revenue aggregation) |

48\. app**.**use("/uploads"**,** express**.**static(path**.**join(\_\_dirname**,** "uploads")))**;**

\-- This is to upload images to the local directory

49\. app**.**use("/uploads/documents"**,**express**.**static(path**.**join(\_\_dirname**,**"uploads/documents")))**;**

**Same as above**

**50\. app.use("/api/categories", categoryRoutes);**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /subcategories/:id | GET | getSubcategories |
| / | GET | getCategories |
| /:id | GET | getCategoryById |
| / | POST | createCategory |
| /:id | POST | createCategory |
| /createsubcategories/:id | POST | getSubcategories |
| /:id | PUT | updateCategory |
| /:id | DELETE | deleteCategory |
| /:id/itemCount | PATCH | updateItemCount |

51\. app**.**use("/api/items"**,** itemRoutes)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| / | POST | (In-router function: Create a new item with image upload) |
| /:id | DELETE | (In-router function: Delete item by ID) |
| /all-items | GET | all-items (Fetch all items with category names) |
| / | GET | (In-router function: Get items filtered by serviceType query) |
| /:id | PATCH | /:id (Update service types for a single item) |
| /update-service-types | POST | update-service-types (Bulk update service types for multiple items) |

52\. app**.**use("/api/combos"**,** comboRoutes)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /:id | POST | /:id (Creates a new combo linked to :id restaurant) |
| /:id | GET | /:id (Gets all combos for a specific restaurant ID) |
| /delete/:id | DELETE | delete/:id (Deletes a combo by its combo ID) |
| / | POST | / (Creates a new combo, likely without a URL parameter) |
| / | GET | / (Gets all combos across all restaurants) |

53\. app**.**use("/api/offers"**,** offerRoutes)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| / | GET | (In-router function: Get all offers) |
| /current-offers/:id | GET | current-offers/:id |
| /pendding-offers/:id | GET | pendding-offers/:id |
| /dining/rest/:id | GET | dining/rest/:id |
| /takeaway/offer/:id | GET | takeaway/offer/:id |
| /takeaway/cart/apply-offers | GET | takeaway/cart/apply-offers |
| /admin/offer | GET | admin/offer |
| /das/add | GET | das/add |
| /admin/accept/:id | PUT | admin/accept/:id |
| /categories/:parentId/subcategories | GET | categories/:parentId/subcategories |
| /items | GET | items |
| / | POST | / (Create new offer - generic) |
| /restaurant/:id | POST | restaurant/:id (Create new offer linked to restaurant) |
| /:id | GET | /:id (Get offer by ID) |
| /:id | PUT | /:id (Update offer by ID) |
| /delete/:id | PUT | delete/:id (Soft delete/hide offer) |
| /suggestion/:id | PUT | suggestion/:id |
| /validate-offer | POST | validate-offer |

54\. app**.**use("/api/operating-hours"**,** operatingHoursOfferRoutes)**;**

| Endpoint | Method | Description |
| --- | --- | --- |
| / | GET | Retrieves all operating hours records with their associated time slot offers populated from the database. |
| /gethours/:id | GET | (Authenticated) Fetches the raw opening_hours for a specific firm ID and generates standardized time slots for daily operations. |
| / | POST | Initializes default operating hours settings for a restaurant (calls the controller function initializeOperatingHours). |
| / | PUT | Updates the general system-wide operating hours settings (calls the controller function updateOperatingHours). |
| /:id | PUT | (Authenticated) Updates the specific daily opening and closing hours for a restaurant identified by its ID. |
| /day/:day/offers | POST | (Authenticated) Adds or updates offers applied to specific 30-minute time slots for a given day (e.g., "Monday, 5:00 PM"). |
| /day/:day/offers | DELETE | (Authenticated) Removes offers associated with specific time slots for a given day. |
| /formatted-with-offers-only | GET | (Authenticated) Fetches operating hours formatted to highlight only the time slots that currently have active offers applied. |
| /formatted | GET | (Authenticated) Fetches the full set of operating hours and time slots, integrating offer information where applicable. |
| /formatted-with-offers-only/:id | GET | Fetches time slots with active offers for a specific restaurant ID, optionally filtered by day via query parameters. |

55\. app**.**use("/api/bookings"**,** bookingRoutes)**;**

| Endpoint | Method | Function Name |
| --- | --- | --- |
| /create | POST | create |
| / | GET | (In-router function: Get all non-history bookings) |
| /userId | GET | userId |
| /cancel/:id | PUT | cancel/:id |
| /:id | POST | /:id (Update booking status) |

56\. app**.**use("/api/taxes"**,** TaxesRoutes)**;**

| Endpoint | Method | Description |
| --- | --- | --- |
| / | GET | (Authenticated) Fetches a list of all tax records in the system. |
| /:id | GET | (Authenticated) Fetches the details of a specific tax record using its ID. |
| /createtax | POST | (Authenticated) Creates and records a new tax type. |
| / | POST | (Authenticated) Creates and records a new tax type (duplicate route). |
| /update/:id | PUT | (Authenticated) Updates all mutable fields (name, rate, etc.) for a specific tax record by its ID. |
| /:id | PUT | (Authenticated) Updates all mutable fields (name, rate, etc.) for a specific tax record by its ID (duplicate route). |
| /delete/:id | DELETE | (Authenticated) Deletes a specific tax record by its ID. |
| /:id | DELETE | (Authenticated) Deletes a specific tax record by its ID (duplicate route). |
| /:id/toggle | PATCH | (Authenticated) Toggles the applicability status (isApplicable) of a specific tax record by its ID. |

57\. app**.**use("/api/charges"**,** ChargesRoutes)**;**

| Endpoint | Method | Description |
| --- | --- | --- |
| /add-Charges/:id | POST | (Authenticated) Creates a new custom charge (e.g., handling fee, convenience fee) for the specified restaurant ID. |
| /get-Charges/:id | GET | Retrieves all standard and custom charges applied to the specified restaurant ID. |
| /update-Charges/:id | PUT | (Authenticated) Updates the details of an existing charge by its ID. |
| /delete-Charges/:id | DELETE | (Authenticated) Deletes a custom charge by its ID. |
| /delivery-ranges/:id | GET | Retrieves all delivery distance ranges and their associated fees for a given restaurant ID. |
| /delivery-ranges/:id | POST | (Authenticated) Adds a new delivery distance range with a corresponding charge to the restaurant's settings. |
| /delivery-ranges/:id | PUT | (Authenticated) Updates the distance parameters or charge amount of a specific delivery range. |
| /delivery-ranges/:id | DELETE | (Authenticated) Deletes a specific delivery distance range. |
| /delivery-ranges/:id | PATCH | (Authenticated) Toggles the active status (isActive) of a specific delivery distance range. |
| /delivery-ranges/bulk | POST | (Authenticated) Replaces or updates the restaurant's entire list of delivery distance ranges in a single request. |
| /delivery-ranges/calculate/:distance | GET | Calculates the appropriate delivery fee for a specified distance based on the restaurant's active distance ranges. |

58\. app**.**use("/api/documents"**,** documentRoutes)**;**

| Endpoint | Method | Description |
| --- | --- | --- |
| /upload | POST | Uploads a single document file (e.g., license, permit) for any service (Restaurant or Tiffin). Requires multipart/form-data. |
| /restaurant/:serviceId | GET | Retrieves a list of all uploaded documents specifically associated with a Restaurant ID. |
| /restaurant/:serviceId/:documentType | DELETE | Deletes a specific document associated with a Restaurant ID by its type (e.g., "license"). |
| /tiffin/:serviceId | GET | Retrieves a list of all uploaded documents specifically associated with a Tiffin ID. |
| /tiffin/:serviceId/:documentType | DELETE | Deletes a specific document associated with a Tiffin ID by its type. |
| /:serviceId | GET | Retrieves all documents for a generic service ID (acts as a fallback or shared endpoint). |
| /:serviceId/:documentType | DELETE | Deletes a specific document by type for a generic service ID. |
| /view/:filename | GET | Serves a specific uploaded document file directly to the user/browser using the file's unique name. |

59\. app**.**use("/api/terms"**,** termsRoutes)**;**

| Endpoint | Method | Description |
| --- | --- | --- |
| /accept/:serviceType | POST | Accepts Terms and Conditions for a service type (Restaurant or Tiffin). This route is designed to handle simultaneous upload of necessary supporting documents (e.g., driver's license, business permits) via a single multipart/form-data request. |

60\. app**.**use("/"**,** createApp)**;**

| Endpoint | Method | Description |
| --- | --- | --- |
| /search | GET | Executes a unified, ranked search across both restaurants and Tiffin services. Results are scored based on fuzzy name match, quality, rating, and optional user proximity (using lat and lon query parameters). Also returns the best-matched food item and recommendations. |
| /recommend | GET | Fetches restaurants similar to a specified restaurant (restaurant query parameter). The similarity is calculated based on shared food items/insights, rating, and distance. |
| /restaurant/:name | GET | Fetches specific details for a single restaurant identified by its name (uses fuzzy matching to find the closest match). |

61\. app**.**use("/banners"**,** bannerRoutes)**;**

| Endpoint | Method | Description |
| --- | --- | --- |
| / | GET | Retrieves a list of all banners, regardless of status. |
| / | POST | Creates a new banner entry in the database. |
| /banner-click/:_id | POST | Tracks a user click on a specific banner ID, adding a timestamped entry to the click counts. |
| /:id/clicks | GET | Retrieves click statistics for a specific banner ID, often filtered by a timeframe query. |
| /active | GET | Fetches only the banners that are currently active (live) based on their start and end dates. |
| /:id | PUT | Updates an existing banner's details (including text, images, and date ranges) using the banner ID. |
| /:id | DELETE | Deletes a banner record by its ID. |

62\. app**.**use("/collections"**,** collectionRoutes)**;**

| Endpoint | Method | Description |
| --- | --- | --- |
| / | GET | Retrieves a list of all collections, regardless of status, for the administrative dashboard. |
| / | POST | Creates a new marketing collection, including image uploads for the collection's visual representation. |
| /like | GET | Fetches a list of collections favorited/liked by the user. |
| /:id/like | POST | Toggles the liked status of a specific collection ID for the current user. |
| /collection-click/:_id | POST | Tracks a user click on a specific collection ID, updating the click count for analytics. |
| /:id/clicks | GET | Retrieves click statistics for a specific collection ID, often filtered by a timeframe query. |
| /active | GET | Fetches only the collections that are currently active (live) based on their date ranges. |
| /by-slug/:slug | GET | Fetches a single collection using its URL-friendly unique identifier (slug). |
| /:id | PUT | Updates an existing collection's details (including items, dates, and images) using the collection ID. |
| /:id | DELETE | Deletes a collection record by its ID. |

63\. app**.**use("/api/marketing-dashboard/collections"**,** collectionRoutes)**;**

| Endpoint | Method | Description |
| --- | --- | --- |
| / | GET | Retrieves a list of all collections for the administrative dashboard. |
| / | POST | Creates a new marketing collection, handling associated image uploads. |
| /like | GET | Fetches a list of collections favorited/liked by the user. |
| /:id/like | POST | Toggles the liked status of a specific collection ID for the current user. |
| /collection-click/:_id | POST | Tracks a user click on a specific collection ID, updating the click count for analytics. |
| /:id/clicks | GET | Retrieves click statistics for a specific collection ID, often filtered by a timeframe query. |
| /active | GET | Fetches only the collections that are currently active (live) based on their date ranges. |
| /by-slug/:slug | GET | Fetches a single collection using its URL-friendly unique identifier (slug). |
| /:id | PUT | Updates an existing collection's details (including items, dates, and images) using the collection ID. |
| /:id | DELETE | Deletes a collection record by its ID. |

64\. app**.**use("/templates"**,** templateRoutes)**;**

| Endpoint | Method | Description |
| --- | --- | --- |
| / | GET | Fetches a list of all email templates in the system. |
| /event | GET | Fetches a specific template based on the required event type (event query parameter is required). |
| /templates-grouped | GET | Fetches all templates and returns them in an object grouped by their type (e.g., "Notification," "Marketing"). |
| / | POST | Creates a new email template, defining its title, subject, body, type, and associated event. |
| /:id | PUT | Updates an existing template using its ID with new content or details. |
| /:id | DELETE | Deletes a template record permanently by its ID. |
| /send-email | POST | Tests the email sending function using a specified template type, recipient email, and optional dynamic placeholders. |

65\. app**.**use("/offers"**,** offerRoutesMarketing)**;**

| Endpoint | Method | Description |
| --- | --- | --- |
| / | GET | Retrieves a list of all offers in the system. |
| / | POST | Creates a new offer entry in the database. |
| /:id | PUT | Updates an existing offer's details using its ID. |
| /delete/:id | PUT | Soft-deletes or deactivates an offer using its ID (often by setting a flag like display: false). |
| /admin | GET | Retrieves a list of offers pending administrative review or action. |
| /suggestion/:id | PUT | Adds or updates an administrative suggestion/note on a specific offer. |
| /admin/accept/:id | PUT | Approves or accepts a specific offer submission. |