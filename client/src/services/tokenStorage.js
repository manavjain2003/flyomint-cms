const TOKEN_KEY = 'cms_token';
const USER_KEY = 'cms_user';

export const session = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUser: () => JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
  save(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
