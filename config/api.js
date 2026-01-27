// API Base URL (not used when using local data)
import { API_CONFIG } from './apiConfig';
export const API_BASE_URL = API_CONFIG.BACKEND_URL;

// API Request Configuration
export const API_REQUEST_CONFIG = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000 // 30 seconds
};
export const API_ENDPOINTS = {
  // ============================================
  // AUTHENTICATION ENDPOINTS
  // ============================================
  AUTH: {
    GET_USER: '/api/user',
    GET_PROFILE: '/api/profile',
    LOGOUT: '/api/Logout',
    EDIT_PROFILE: '/user/profileEdit'
  },

  // ============================================
  // EVENTS ENDPOINTS
  // ============================================
  EVENTS: {
    LIST: '/api/events',
    DETAIL: (id) => `/api/events/${id}`,
    FEATURED: '/api/events/featured',
    SEARCH: '/api/events/search'
  },

  // ============================================
  // TIFFIN SERVICE ENDPOINTS
  // ============================================
  TIFFIN: {
    GET_ALL: '/api/tiffin',
    GET_BY_ID: (id) => `/api/tiffin/${id}`,
    CREATE: '/api/tiffin',
    UPDATE: (id) => `/api/tiffin/${id}`,
    DELETE: (id) => `/api/tiffin/${id}`,
    SEARCH: '/api/tiffin/search',
    GET_LIKED: '/api/tiffins/liked',
    GET_ONE: (id) => `/api/get-tiffin/${id}`,
    OFFERS: (id) => `/api/tiffin/offers/${id}`
  },

  // ============================================
  // TAKEAWAY SERVICE ENDPOINTS
  // ============================================
  TAKEAWAY: {
    GET_ALL_RESTAURANTS: '/firm/get-all/restaurants',
    GET_NEARBY: (feature) => `/firm/getnearbyrest?feature=${feature}`,
    GET_ONE: (id) => `/firm/getOne/${id}`,
    GET_RECENTLY_VIEWED: '/firm/getrecently-viewed',
    POST_RECENTLY_VIEWED: (restId) => `/firm/recently-viewed/${restId}`,
    SEARCH: '/search',
    GET_BY_CUISINE: (cuisine) => `/firm/getnearbyrest?cuisines=${cuisine}`,
    GET_LIKED_RESTAURANTS: '/firm/user/liked-restaurants'
  },

  // ============================================
  // RESTAURANT/FIRM ENDPOINTS
  // ============================================
  RESTAURANT: {
    GET_ONE: (id) => `/firm/getOne/${id}`,
    GET_ALL: '/firm/get-all/restaurants',
    NEARBY: (feature) => `/firm/getnearbyrest?feature=${feature}`,
    RECENTLY_VIEWED: '/firm/getrecently-viewed',
    POST_RECENTLY_VIEWED: (restId) => `/firm/recently-viewed/${restId}`,
    LIKED: '/firm/user/liked-restaurants'
  },

  // ============================================
  // DINING BOOKING ENDPOINTS
  // ============================================
  DiningBooking: {
    GET_ALL: '/api/bookings',
    GET_BY_ID: (id) => `/api/bookings/${id}`,
    CREATE: '/api/bookings/create',
    UPDATE: (id) => `/api/bookings/${id}`,
    CANCEL: (id) => `/api/bookings/cancel/${id}`,
    GET_USER: '/api/UserBookings',
    GET_BY_USERID: '/api/bookings/userId',
    UPDATE_STATUS: (id) => `/api/bookings/${id}/status`
  },

  // ============================================
  // CART ENDPOINTS
  // ============================================
  CART: {
    GET: '/cart',
    POST: '/cart',
    PUT: '/cart',
    DELETE: '/cart/clear',
    GET_COUNT: '/count',
    CREATE_ORDER: '/api/create'
  },

  // ============================================
  // ORDERS ENDPOINTS
  // ============================================
  ORDERS: {
    GET_ALL: '/api/orders',
    GET_BY_ID: (id) => `/api/orders/${id}`,
    CREATE: '/api/orders',
    UPDATE: (id) => `/api/orders/${id}`,
    UPDATE_STATUS: (id) => `/api/orders/${id}/status`,
    CREATE_TAKEAWAY: '/api/create'
  },

  // ============================================
  // REVIEWS ENDPOINTS
  // ============================================
  REVIEWS: {
    GET_ALL: '/api/reviews',
    GET_BY_ID: (id) => `/api/reviews/${id}`,
    CREATE: '/api/reviews',
    UPDATE: (id) => `/api/reviews/${id}`,
    DELETE: (id) => `/api/reviews/${id}`,
    GET_STATUS: (id) => `/api/reviews/${id}/status`,
    GET_USER_PROFILE: '/api/reviews/user/profile',
    LIKE: (id) => `/api/reviews/${id}/like`,
    UNLIKE: (id) => `/api/reviews/${id}/unlike`,
    HELPFUL: (id) => `/api/reviews/${id}/helpful`,
    NOT_HELPFUL: (id) => `/api/reviews/${id}/not-helpful`
  },

  // ============================================
  // NOTIFICATIONS ENDPOINTS
  // ============================================
  NOTIFICATIONS: {
    GET: '/api/getnotifications',
    GET_INFO: '/api/getNotificationsInfo',
    POST_INFO: '/api/postNotificationsInfo',
    PUT: '/api/putnotifications',
    DELETE: (id) => `/api/deleteNotificationsInfo/${id}`,
    DELETE_LEGACY: (id) => `/api/deleteNotificatonsInfo/${id}`
  },

  // ============================================
  // ADDRESS ENDPOINTS
  // ============================================
  ADDRESS: {
    GET_SAVED: '/api/getSavedAddress',
    PUT: '/api/SaveUserAddress',
    DELETE: (id) => `/api/DeleteUserAddress/${id}`
  },

  // ============================================
  // LOCATION ENDPOINTS
  // ============================================
  LOCATION: {
    GET: '/api/location'
  },

  // ============================================
  // VEG MODE ENDPOINTS
  // ============================================
  VEG_MODE: {
    GET: '/api/getVegMode',
    UPDATE: '/api/updateVegMode'
  },

  // ============================================
  // OFFERS ENDPOINTS
  // ============================================
  OFFERS: {
    GET_ALL: '/offers',
    DELETE: (id) => `/delete/offers/${id}`,
    POST: '/offers'
  },

  // ============================================
  // BANNERS ENDPOINTS
  // ============================================
  BANNERS: {
    GET_ALL: '/banners',
    CLICK: (id) => `/banners/banner-click/${id}`
  },

  // ============================================
  // COLLECTIONS ENDPOINTS
  // ============================================
  COLLECTIONS: {
    GET_ALL: '/collections'
  },

  // ============================================
  // FAQ ENDPOINTS
  // ============================================
  FAQ: {
    GET_ALL: '/api/faq'
  },

  // ============================================
  // RECOMMENDATIONS ENDPOINTS
  // ============================================
  RECOMMENDATIONS: {
    GET: (restaurant) => `/recommend?restaurant=${restaurant}`
  },

  // ============================================
  // PRODUCTS ENDPOINTS
  // ============================================
  PRODUCTS: {
    GET_BY_IDS: (ids) => `?ids=${ids.join(',')}`
  }
};

// API Response Status Codes
export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMIT: 429,
  SERVER_ERROR: 500
};

// API Error Messages
export const API_ERRORS = {
  UNKNOWN: 'An unknown error occurred',
  NETWORK: 'Network error occurred. Please check your internet connection and try again.',
  SERVER: 'Server error occurred. Please try again later.',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access. Please log in again.',
  FORBIDDEN: 'Access forbidden. You do not have permission to access this resource.',
  VALIDATION: 'Validation error occurred. Please check your input.',
  TIMEOUT: 'Request timed out. Please try again.',
  BAD_REQUEST: 'Invalid request. Please check your input.',
  RATE_LIMIT: 'Too many requests. Please try again later.',
  FIRM_NOT_FOUND: 'Restaurant not found',
  MENU_NOT_FOUND: 'Menu not found',
  REVIEW_ERROR: 'Error submitting review',
  TIFFIN_NOT_FOUND: 'Tiffin service not found',
  PLAN_NOT_FOUND: 'Subscription plan not found',
  PLAN_LABEL_REQUIRED: 'Plan label is required',
  INCOMPLETE_MEAL_TYPE: 'Incomplete meal type information',
  DUPLICATE_ENTRY: 'Email or phone number already exists',
  CONNECTION_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  RETRY_ERROR: 'Failed to complete request after multiple retries. Please try again later.'
};