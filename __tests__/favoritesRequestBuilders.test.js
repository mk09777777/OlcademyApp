import {
  buildCredentialsPostArgs,
  buildCredentialsPostNoBodyArgs,
} from '../utils/favoritesRequestBuilders';

describe('favoritesRequestBuilders', () => {
  test('buildCredentialsPostNoBodyArgs returns axios args with empty body + withCredentials', () => {
    const [url, body, config] = buildCredentialsPostNoBodyArgs('/api/favorites/add/123');

    expect(url).toBe('/api/favorites/add/123');
    expect(body).toEqual({});
    expect(config).toEqual({ withCredentials: true });
  });

  test('buildCredentialsPostArgs preserves body and sets withCredentials', () => {
    const payload = { foo: 'bar' };
    const [url, body, config] = buildCredentialsPostArgs('/api/favorites/add/123', payload);

    expect(url).toBe('/api/favorites/add/123');
    expect(body).toBe(payload);
    expect(config).toEqual({ withCredentials: true });
  });
});
