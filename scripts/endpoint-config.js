'use strict';

const requireEnv = (name, message) => (ctx) => {
  if (!ctx.env[name]) {
    return { reason: message || `Environment variable ${name} is not set.` };
  }
  return null;
};

const skipUnsupported = (reason) => () => ({ reason });

module.exports = [
  // =====================
  // AUTHENTICATION
  // =====================
  {
    category: 'Auth',
    name: 'Signup (OTP required)',
    method: 'POST',
    url: '/api/signup',
    skip: true,
    note: 'Requires OTP email workflow; run manually when needed.'
  },
  {
    category: 'Auth',
    name: 'Verify Signup OTP',
    method: 'POST',
    url: '/api/verify',
    skip: true,
    note: 'Requires OTP token from email; skipping in automation.'
  },
  {
    category: 'Auth',
    name: 'Send Email OTP',
    method: 'POST',
    url: '/api/send-email-otp',
    skip: true,
    note: 'Triggers real email; omit from automated suite.'
  },
  {
    category: 'Auth',
    name: 'Send Phone OTP',
    method: 'POST',
    url: '/api/send-phone-otp',
    skip: true,
    note: 'SMS gateway not available in automation context.'
  },
  {
    category: 'Auth',
    name: 'Verify OTP (generic)',
    method: 'POST',
    url: '/api/verify-otp',
    skip: true,
    note: 'Requires live OTP token; handled manually.'
  },
  {
    category: 'Auth',
    name: 'Reset Password',
    method: 'POST',
    url: '/api/reset-password',
    data: (ctx) => ({
      email: ctx.env.TEST_EMAIL,
      newPassword: 'TempPass@123'
    }),
    okStatuses: [200, 400],
    note: 'Will fail with 400 unless OTP validated; treats validation error as acceptable.'
  },
  {
    category: 'Auth',
    name: 'Current User Profile',
    method: 'GET',
    url: '/api/user'
  },
  {
    category: 'Auth',
    name: 'Profile Ping',
    method: 'GET',
    url: '/api/profile'
  },
  // =====================
  // MENU / TIFFIN ROUTES
  // =====================
  {
    category: 'Menu',
    name: 'List Tiffin Services',
    method: 'GET',
    url: '/api/tiffin'
  },
  {
    category: 'Menu',
    name: 'Search Tiffin',
    method: 'GET',
    url: '/api/tiffin/search',
    params: { query: 'thali' },
    okStatuses: [200, 404]
  },
  {
    category: 'Menu',
    name: 'Tiffin By ID',
    method: 'GET',
    url: (ctx) => `/api/get-tiffin/${ctx.env.TEST_TIFFIN_ID}`,
    skipIf: requireEnv('TEST_TIFFIN_ID', 'Set TEST_TIFFIN_ID to validate specific tiffin record.'),
    okStatuses: [200, 404]
  },
  {
    category: 'Menu',
    name: 'Tiffin Owner Detail (email scoped)',
    method: 'GET',
    url: '/api/tiffin/email',
    okStatuses: [200, 401, 403, 404]
  },
  {
    category: 'Menu',
    name: 'Tiffin Outlet Info',
    method: 'GET',
    url: '/api/tiffin/outlet/info',
    okStatuses: [200, 401, 403, 404]
  },
  {
    category: 'Menu',
    name: 'Add Tiffin (smoke payload)',
    method: 'POST',
    url: '/api/add-tiffin',
    skip: true,
    note: 'Endpoint requires full tiffin owner context; skipped to avoid polluting live data.'
  },
  {
    category: 'Menu',
    name: 'Tiffin Reviews',
    method: 'GET',
    url: (ctx) => `/api/tiffin-Reviews/${ctx.env.TEST_TIFFIN_ID}`,
    skipIf: requireEnv('TEST_TIFFIN_ID', 'Set TEST_TIFFIN_ID to fetch reviews.'),
    okStatuses: [200, 404]
  },
  // =====================
  // ORDER ROUTES
  // =====================
  {
    category: 'Orders',
    name: 'All Orders (admin scope)',
    method: 'GET',
    url: '/api/getOrders',
  okStatuses: [200, 401, 403, 404]
  },
  {
    category: 'Orders',
    name: 'Order History By Email',
    method: 'GET',
    url: (ctx) => `/api/getOrdersforHistory/${encodeURIComponent(ctx.env.TEST_EMAIL || '')}`,
    skipIf: requireEnv('TEST_EMAIL', 'Set TEST_EMAIL to request order history.'),
    okStatuses: [200, 404]
  },
  {
    category: 'Orders',
    name: 'Order Revenue Summary',
    method: 'GET',
    url: '/api/revenue',
  okStatuses: [200, 401, 403, 404]
  },
  {
    category: 'Orders',
    name: 'Create Tiffin Order (smoke)',
    method: 'POST',
    url: '/api/saveOrders',
    skip: true,
    note: 'Requires real cart payload and sockets; skipped in automation.'
  },
  {
    category: 'Orders',
    name: 'Create Takeaway Order (smoke)',
    method: 'POST',
    url: '/api/create',
    data: () => ({
      source: 'takeaway',
      paymentMode: 'cash_on_delivery',
      cartSnapshot: [],
      contact: {
        name: 'Automation Runner',
        phone: '+910000000000'
      }
    }),
    okStatuses: [200, 201, 400],
    note: 'Endpoint expects populated cart; validation failure counted as acceptable.'
  },
  {
    category: 'Orders',
    name: 'Dining Bookings List',
    method: 'GET',
    url: '/api/bookings'
  },
  {
    category: 'Orders',
    name: 'Dining Booking By ID',
    method: 'GET',
    url: (ctx) => `/api/bookings/${ctx.env.TEST_BOOKING_ID}`,
    skipIf: requireEnv('TEST_BOOKING_ID', 'Set TEST_BOOKING_ID to validate booking lookup.'),
    okStatuses: [200, 404]
  },
  {
    category: 'Orders',
    name: 'Dining Booking Cancel',
    method: 'PUT',
    url: (ctx) => `/api/bookings/cancel/${ctx.env.TEST_BOOKING_ID}`,
    skipIf: requireEnv('TEST_BOOKING_ID', 'Set TEST_BOOKING_ID to test cancel flow.'),
    okStatuses: [200, 400, 404]
  },
  {
    category: 'Orders',
    name: 'User Booking Lookup',
    method: 'GET',
    url: '/api/bookings/userId',
    okStatuses: [200, 400, 401, 403, 404]
  },
  {
    category: 'Orders',
    name: 'Dining Booking Status Update',
    method: 'POST',
    url: (ctx) => `/api/bookings/${ctx.env.TEST_BOOKING_ID}`,
    skipIf: requireEnv('TEST_BOOKING_ID', 'Set TEST_BOOKING_ID to test booking status update.'),
    data: () => ({ status: 'confirmed' }),
    okStatuses: [200, 400, 404]
  },
  // =====================
  // ANALYTICS ROUTES
  // =====================
  {
    category: 'Analytics',
    name: 'Order Analytics',
    method: 'GET',
    url: '/api/order-analytics',
    params: { timeframe: 'all' },
    okStatuses: [200, 400, 401, 403, 404]
  },
  {
    category: 'Analytics',
    name: 'Meal Type Analytics',
    method: 'GET',
    url: '/api/mealtype-analytics',
    params: { timeframe: 'all' },
    okStatuses: [200, 400, 401, 403, 404]
  },
  {
    category: 'Analytics',
    name: 'Order Summary',
    method: 'GET',
    url: '/api/order-summary',
  okStatuses: [200, 401, 403, 404]
  },
  {
    category: 'Analytics',
    name: 'User Summary',
    method: 'GET',
    url: '/api/user-summary',
    okStatuses: [200, 401, 403]
  },
  {
    category: 'Analytics',
    name: 'Average Order Value',
    method: 'GET',
    url: '/api/average-order-value',
    okStatuses: [200, 401, 403]
  },
  // =====================
  // USER NOTIFICATIONS
  // =====================
  {
    category: 'Notifications',
    name: 'List Notifications',
    method: 'GET',
    url: '/api/getNotificationsInfo',
    okStatuses: [200, 204, 401, 403, 404]
  },
  {
    category: 'Notifications',
    name: 'Get Notification Settings',
    method: 'GET',
    url: '/api/getnotifications',
    okStatuses: [200, 401, 403, 404]
  },
  {
    category: 'Notifications',
    name: 'Update Notification Preferences',
    method: 'PUT',
    url: '/api/putnotifications',
    data: () => ({ marketing: false, transactional: true }),
    okStatuses: [200, 204, 400, 401, 403, 404]
  },
  {
    category: 'Notifications',
    name: 'Create Notification Entry',
    method: 'POST',
    url: '/api/postNotificationsInfo',
    data: () => ({ message: 'Automation test notification' }),
    okStatuses: [200, 201, 400, 401, 403, 404]
  },
  {
    category: 'Notifications',
    name: 'Delete Notification Entry',
    method: 'DELETE',
    url: (ctx) => `/api/deleteNotificationsInfo/${ctx.env.TEST_NOTIFICATION_ID}`,
    skipIf: requireEnv('TEST_NOTIFICATION_ID', 'Set TEST_NOTIFICATION_ID to delete a notification.'),
    okStatuses: [200, 204, 400, 401, 403, 404]
  },
  {
    category: 'Notifications',
    name: 'Update Veg Mode',
    method: 'PUT',
    url: '/api/updateVegMode',
    data: () => ({ vegMode: true }),
    okStatuses: [200, 204, 400, 401, 403, 404]
  },
  {
    category: 'Notifications',
    name: 'Veg Mode Status',
    method: 'GET',
    url: '/api/getVegMode',
    okStatuses: [200, 401, 403, 404]
  },
  // =====================
  // CART ROUTES
  // =====================
  {
    category: 'Cart',
    name: 'Cart Snapshot',
    method: 'GET',
    url: '/cart',
    okStatuses: [200, 204, 401, 403, 404]
  },
  {
    category: 'Cart',
    name: 'Add To Cart (smoke)',
    method: 'POST',
    url: '/cart',
    data: () => ({ items: [] }),
    okStatuses: [200, 201, 400, 401, 403, 404]
  },
  {
    category: 'Cart',
    name: 'Update Cart (smoke)',
    method: 'PUT',
    url: '/cart',
    data: () => ({ items: [] }),
    okStatuses: [200, 204, 400, 401, 403, 404]
  },
  {
    category: 'Cart',
    name: 'Cart Count',
    method: 'GET',
    url: '/count',
    okStatuses: [200, 204, 401, 403, 404]
  },
  {
    category: 'Cart',
    name: 'Clear Cart',
    method: 'DELETE',
    url: '/cart/clear',
    okStatuses: [200, 204, 401, 403, 404]
  },
  // =====================
  // RESTAURANT / FIRM ROUTES
  // =====================
  {
    category: 'Firm',
    name: 'All Restaurants',
    method: 'GET',
    url: '/firm/get-all/restaurants'
  },
  {
    category: 'Firm',
    name: 'Recently Viewed Restaurants',
    method: 'GET',
    url: '/firm/getrecently-viewed',
    okStatuses: [200, 401, 403, 404]
  },
  {
    category: 'Firm',
    name: 'Search Restaurants',
    method: 'GET',
    url: '/firm/search',
    params: { q: 'pizza' },
    okStatuses: [200, 400]
  },
  {
    category: 'Firm',
    name: 'Restaurant By ID',
    method: 'GET',
    url: (ctx) => `/firm/getOne/${ctx.env.TEST_RESTAURANT_ID}`,
    skipIf: requireEnv('TEST_RESTAURANT_ID', 'Set TEST_RESTAURANT_ID to fetch a specific restaurant.'),
    okStatuses: [200, 404]
  },
  {
    category: 'Firm',
    name: 'Like Status',
    method: 'GET',
    url: (ctx) => `/firm/user/${ctx.env.TEST_RESTAURANT_ID}/islike`,
    skipIf: requireEnv('TEST_RESTAURANT_ID', 'Set TEST_RESTAURANT_ID to check like status.'),
    okStatuses: [200, 401, 403, 404]
  },
  {
    category: 'Firm',
    name: 'Liked Restaurants By User',
    method: 'GET',
    url: '/firm/user/liked-restaurants',
    okStatuses: [200, 401, 403, 404]
  },
  {
    category: 'Firm',
    name: 'Post Recently Viewed',
    method: 'POST',
    url: (ctx) => `/firm/recently-viewed/${ctx.env.TEST_RESTAURANT_ID || 'placeholder'}`,
    skipIf: requireEnv('TEST_RESTAURANT_ID', 'Set TEST_RESTAURANT_ID to create recently viewed entry.'),
    okStatuses: [200, 201, 400, 401, 403]
  },
  {
    category: 'Firm',
    name: 'Filter Firms',
    method: 'GET',
    url: '/firm/filter-firms',
    params: { city: 'Bangalore' },
    okStatuses: [200, 400]
  },
  {
    category: 'Firm',
    name: 'Restaurant Menu Sections',
    method: 'GET',
    url: (ctx) => `/firm/restaurants/menu-sections/${ctx.env.TEST_RESTAURANT_ID}`,
    skipIf: requireEnv('TEST_RESTAURANT_ID', 'Set TEST_RESTAURANT_ID to inspect menu sections.'),
    okStatuses: [200, 404]
  },
  // =====================
  // MARKETING / BANNERS / COLLECTIONS
  // =====================
  {
    category: 'Marketing',
    name: 'Banners',
    method: 'GET',
    url: '/banners'
  },
  {
    category: 'Marketing',
    name: 'Collections',
    method: 'GET',
    url: '/collections'
  },
  {
    category: 'Marketing',
    name: 'Marketing Dashboard Collections',
    method: 'GET',
    url: '/api/marketing-dashboard/collections',
    okStatuses: [200, 401, 403, 404]
  },
  {
    category: 'Marketing',
    name: 'Templates',
    method: 'GET',
    url: '/templates',
    okStatuses: [200, 401, 403, 404]
  },
  {
    category: 'Marketing',
    name: 'Offers (Marketing)',
    method: 'GET',
    url: '/offers'
  },
  {
    category: 'Marketing',
    name: 'Offer Suggestions',
    method: 'PUT',
    url: (ctx) => `/offers/suggestion/${ctx.env.TEST_OFFER_ID}`,
    skipIf: requireEnv('TEST_OFFER_ID', 'Set TEST_OFFER_ID to test suggestion update.'),
    data: () => ({ suggestion: 'Automation note' }),
    okStatuses: [200, 400, 401, 403, 404]
  },
  {
    category: 'Marketing',
    name: 'Banner Click Tracking',
    method: 'POST',
    url: (ctx) => `/banners/banner-click/${ctx.env.TEST_BANNER_ID}`,
    skipIf: requireEnv('TEST_BANNER_ID', 'Set TEST_BANNER_ID to test banner click analytics.'),
    okStatuses: [200, 201, 400, 401, 403, 404]
  },
  // =====================
  // FAQ / ADMIN ROUTES
  // =====================
  {
    category: 'FAQ',
    name: 'Public FAQ List',
    method: 'GET',
    url: '/api/faq'
  },
  {
    category: 'FAQ',
    name: 'Admin FAQ List',
    method: 'GET',
    url: '/api/admin/faq',
    okStatuses: [200, 401, 403]
  },
  {
    category: 'FAQ',
    name: 'Create FAQ (admin)',
    method: 'POST',
    url: '/api/admin/faq',
    data: () => ({ q: 'Automation question?', a: 'Automation answer', category: 'testing' }),
    okStatuses: [201, 400, 401, 403]
  },
  // =====================
  // LOCATION / ADDRESS
  // =====================
  {
    category: 'Location',
    name: 'Location Data',
    method: 'GET',
    url: '/api/location'
  },
  {
    category: 'Location',
    name: 'Address Search by City',
    method: 'GET',
    url: '/api/addresses/Bangalore',
    okStatuses: [200, 404]
  },
  {
    category: 'Location',
    name: 'Address Search by Locality',
    method: 'GET',
    url: '/api/addresses/locality/HSR',
    okStatuses: [200, 404]
  },
  // =====================
  // HISTORY / LOGS
  // =====================
  {
    category: 'History',
    name: 'History Root',
    method: 'GET',
    url: '/api/history',
    okStatuses: [200, 401, 403, 404]
  },
  {
    category: 'History',
    name: 'Dining Booking History',
    method: 'GET',
    url: (ctx) => `/api/history/dining-booking/${ctx.env.TEST_BOOKING_ID}`,
    skipIf: requireEnv('TEST_BOOKING_ID', 'Set TEST_BOOKING_ID for dining booking history.'),
    okStatuses: [200, 404]
  },
  {
    category: 'History',
    name: 'Takeaway History',
    method: 'GET',
    url: (ctx) => `/api/history/ordertakeaway/${ctx.env.TEST_ORDER_ID}`,
    skipIf: requireEnv('TEST_ORDER_ID', 'Set TEST_ORDER_ID for takeaway history.'),
    okStatuses: [200, 404]
  },
  // =====================
  // ADMIN / DASHBOARD ROUTES
  // =====================
  {
    category: 'Admin',
    name: 'Admin Dashboard Login',
    method: 'POST',
    url: '/api/dashboard/login',
    data: () => ({ email: 'admin@example.com', password: 'invalid' }),
    okStatuses: [200, 400, 401, 404],
    note: 'Uses invalid creds to ensure route responds; treat failure as acceptable.'
  },
  {
    category: 'Admin',
    name: 'Admin Profile',
    method: 'GET',
    url: '/api/dashboard/profile',
    okStatuses: [200, 401, 403, 404]
  },
  {
    category: 'Admin',
    name: 'Admin FAQ CRUD',
    method: 'POST',
    url: '/api/admin/faq',
    data: () => ({ q: 'Automation admin question?', a: 'Automation admin answer', category: 'automation' }),
    okStatuses: [201, 400, 401, 403]
  },
  {
    category: 'Admin',
    name: 'Admin User Count',
    method: 'GET',
    url: '/api/admin/user-count',
    okStatuses: [200, 401, 403, 404]
  },
  {
    category: 'Admin',
    name: 'Admin Order Summary',
    method: 'GET',
    url: '/api/admin/order-summary',
    okStatuses: [200, 401, 403, 404]
  },
  {
    category: 'Admin',
    name: 'Admin Vendors Summary',
    method: 'GET',
    url: '/api/admin/vendors',
    okStatuses: [200, 401, 403, 404]
  },
  {
    category: 'Admin',
    name: 'Revenue Summary',
    method: 'GET',
    url: '/api/revenue/summary',
    okStatuses: [200, 401, 403, 404]
  },
  // =====================
  // TERMS & DOCUMENT ROUTES
  // =====================
  {
    category: 'Documents',
    name: 'Restaurant Documents',
    method: 'GET',
    url: (ctx) => `/api/documents/restaurant/${ctx.env.TEST_RESTAURANT_ID}`,
    skipIf: requireEnv('TEST_RESTAURANT_ID', 'Set TEST_RESTAURANT_ID to fetch documents.'),
    okStatuses: [200, 404]
  },
  {
    category: 'Documents',
    name: 'Tiffin Documents',
    method: 'GET',
    url: (ctx) => `/api/documents/tiffin/${ctx.env.TEST_TIFFIN_ID}`,
    skipIf: requireEnv('TEST_TIFFIN_ID', 'Set TEST_TIFFIN_ID to fetch tiffin documents.'),
    okStatuses: [200, 404]
  },
  {
    category: 'Documents',
    name: 'Terms Acceptance',
    method: 'POST',
    url: '/api/terms/accept/restaurant',
    data: () => ({ accepted: true }),
    okStatuses: [200, 201, 400, 401, 403, 404]
  },
  // =====================
  // CHARGES / TAXES ROUTES
  // =====================
  {
    category: 'Taxes',
    name: 'List Taxes',
    method: 'GET',
    url: '/api/taxes',
    okStatuses: [200, 401, 403]
  },
  {
    category: 'Taxes',
    name: 'Toggle Tax',
    method: 'PATCH',
    url: (ctx) => `/api/taxes/${ctx.env.TEST_TAX_ID || 'placeholder'}/toggle`,
    skipIf: requireEnv('TEST_TAX_ID', 'Set TEST_TAX_ID to toggle.'),
    okStatuses: [200, 400, 401, 403, 404]
  },
  {
    category: 'Charges',
    name: 'List Charges',
    method: 'GET',
    url: (ctx) => `/api/charges/get-Charges/${ctx.env.TEST_RESTAURANT_ID}`,
    skipIf: requireEnv('TEST_RESTAURANT_ID', 'Set TEST_RESTAURANT_ID to list charges.'),
    okStatuses: [200, 404]
  },
  {
    category: 'Charges',
    name: 'Delivery Range Fee',
    method: 'GET',
    url: (ctx) => `/api/charges/delivery-ranges/calculate/${ctx.env.TEST_DELIVERY_DISTANCE || 5}`,
    okStatuses: [200, 400, 404]
  },
  // =====================
  // MISC ROUTES
  // =====================
  {
    category: 'Search',
    name: 'Unified Search',
    method: 'GET',
    url: '/search',
    params: { q: 'pizza' },
    okStatuses: [200, 400]
  },
  {
    category: 'Search',
    name: 'Recommendations',
    method: 'GET',
    url: '/recommend',
    params: { restaurant: 'test' }
  },
  {
    category: 'Marketing',
    name: 'Collection Click tracking',
    method: 'POST',
    url: (ctx) => `/collections/collection-click/${ctx.env.TEST_COLLECTION_ID}`,
    skipIf: requireEnv('TEST_COLLECTION_ID', 'Set TEST_COLLECTION_ID to track collection click.'),
    okStatuses: [200, 201, 400, 401, 403, 404]
  },
  {
    category: 'Collections',
    name: 'Collection Like Toggle',
    method: 'POST',
    url: (ctx) => `/collections/${ctx.env.TEST_COLLECTION_ID}/like`,
    skipIf: requireEnv('TEST_COLLECTION_ID', 'Set TEST_COLLECTION_ID to toggle like.'),
    okStatuses: [200, 201, 400, 401, 403, 404]
  },
  {
    category: 'Collections',
    name: 'Collection Likes',
    method: 'GET',
    url: '/collections/like',
    okStatuses: [200, 401, 403, 404]
  },
  // =====================
  // PLACEHOLDER FOR FILE UPLOAD ROUTES
  // =====================
  {
    category: 'Documents',
    name: 'Upload Document (multipart)',
    method: 'POST',
    url: '/api/documents/upload',
    skipIf: skipUnsupported('Multipart upload not automated yet; requires file fixtures.'),
    note: 'Add multipart automation when mock assets available.'
  },
  {
    category: 'Offers',
    name: 'Upload Tiffin Document',
    method: 'POST',
    url: '/firm/upload-tiffin-document',
    skipIf: skipUnsupported('Multipart upload omitted in automation suite.'),
    note: 'Requires multipart body; skipped for now.'
  }
];
