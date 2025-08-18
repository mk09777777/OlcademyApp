// API Base URL (not used when using local data)
export const API_BASE_URL = 'http://localhost:3000';

// API Request Configuration
export const API_CONFIG = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000 // 30 seconds
};
export const API_ENDPOINTS = {
  TIFFIN: {
    GET_ALL: '/api/tiffin',
    GET_BY_ID: (id) => `/api/tiffin/${id}`,
    CREATE: '/api/tiffin',
    UPDATE: (id) => `/api/tiffin/${id}`,
    DELETE: (id) => `/api/tiffin/${id}`,
    SEARCH: '/api/tiffin/search'
  },
  ORDERS: {
    GET_ALL: '/api/orders',
    GET_BY_ID: (id) => `/api/orders/${id}`,
    CREATE: '/api/orders',
    UPDATE: (id) => `/api/orders/${id}`,
    UPDATE_STATUS: (id) => `/api/orders/${id}/status`
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