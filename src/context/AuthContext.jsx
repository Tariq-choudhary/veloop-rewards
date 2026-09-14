import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'veloopUser';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Where to send the player back to once they finish logging in.
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback(({ name, email, contact }) => {
    const cleanName = (name || '').trim() || 'Player';
    const cleanEmail = (email || '').trim();
    const cleanContact = (contact || '').trim();
    setUser({
      name: cleanName,
      email: cleanEmail,
      contact: cleanContact,
      id: `user_${cleanName.toLowerCase().replace(/\s+/g, '_')}`,
    });
    setLoginModalOpen(false);
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const requireLogin = useCallback((onSuccessPath) => {
    setRedirectAfterLogin(onSuccessPath || null);
    setLoginModalOpen(true);
  }, []);

  const value = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    requireLogin,
    loginModalOpen,
    setLoginModalOpen,
    redirectAfterLogin,
    setRedirectAfterLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
