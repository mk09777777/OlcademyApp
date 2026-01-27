export const shouldLogoutOnAuthFailure = (status) => {
  return status === 401 || status === 403;
};

// Pure decision model for tests. Keeps Phase 7.3 intent:
// - If no stored user: unauthenticated + redirect
// - If validation succeeds: authenticated
// - If validation fails with 401/403: clear auth + redirect
// - Otherwise: keep local auth (transient/offline/5xx)
export const decideAuthBootstrapAction = ({
  hasStoredUserData,
  validationSucceeded,
  errorStatus,
} = {}) => {
  if (!hasStoredUserData) {
    return 'redirect_login';
  }

  if (validationSucceeded) {
    return 'accept_validated_auth';
  }

  if (shouldLogoutOnAuthFailure(errorStatus)) {
    return 'clear_and_redirect_login';
  }

  return 'keep_local_auth';
};
