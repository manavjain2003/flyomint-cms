import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { setUnauthorizedHandler } from '../services/apiClient.js';
import { authService } from '../services/authService.js';
import { session } from '../services/tokenStorage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (session.getToken() ? session.getUser() : null));

  const login = useCallback(async (username, password) => {
    const { token, user: loggedInUser } = await authService.login(username, password);
    session.save(token, loggedInUser);
    setUser(loggedInUser);
  }, []);

  const logout = useCallback(() => {
    session.clear();
    setUser(null);
  }, []);

  useEffect(() => setUnauthorizedHandler(logout), [logout]);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), isAdmin: user?.role === 'admin', login, logout }),
    [user, login, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
