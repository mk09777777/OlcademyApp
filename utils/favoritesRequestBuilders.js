export const buildCredentialsPostNoBodyArgs = (url) => {
  return [url, {}, { withCredentials: true }];
};

export const buildCredentialsPostArgs = (url, body = {}) => {
  return [url, body ?? {}, { withCredentials: true }];
};
