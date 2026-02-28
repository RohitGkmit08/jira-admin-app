const TOKEN_KEY = 'token';

export const authService = {
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
