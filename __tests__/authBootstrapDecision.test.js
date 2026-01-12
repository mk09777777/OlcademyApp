import {
  decideAuthBootstrapAction,
  shouldLogoutOnAuthFailure,
} from '../utils/authBootstrapDecision';

describe('authBootstrapDecision', () => {
  test('shouldLogoutOnAuthFailure only for 401/403', () => {
    expect(shouldLogoutOnAuthFailure(401)).toBe(true);
    expect(shouldLogoutOnAuthFailure(403)).toBe(true);
    expect(shouldLogoutOnAuthFailure(500)).toBe(false);
    expect(shouldLogoutOnAuthFailure(undefined)).toBe(false);
  });

  test('decideAuthBootstrapAction redirects when no stored user', () => {
    expect(decideAuthBootstrapAction({ hasStoredUserData: false })).toBe('redirect_login');
  });

  test('decideAuthBootstrapAction accepts validated auth when validation succeeds', () => {
    expect(
      decideAuthBootstrapAction({
        hasStoredUserData: true,
        validationSucceeded: true,
      })
    ).toBe('accept_validated_auth');
  });

  test('decideAuthBootstrapAction clears auth only on 401/403', () => {
    expect(
      decideAuthBootstrapAction({
        hasStoredUserData: true,
        validationSucceeded: false,
        errorStatus: 401,
      })
    ).toBe('clear_and_redirect_login');

    expect(
      decideAuthBootstrapAction({
        hasStoredUserData: true,
        validationSucceeded: false,
        errorStatus: 500,
      })
    ).toBe('keep_local_auth');
  });
});
