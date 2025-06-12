
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useToast } from './ToastContext';
import { useLanguage } from './LanguageContext';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (user: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [username, setUsername] = useState<string | null>(() => {
    return localStorage.getItem('username');
  });
  const { showToast } = useToast();
  const { translate } = useLanguage();

  useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
    if (username) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }
  }, [isAuthenticated, username]);

  const login = async (user: string, pass: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if ((user === 'admin@example.com' || user === 'test@example.com') && pass === 'password') {
          setIsAuthenticated(true);
          const namePart = user.split('@')[0];
          setUsername(namePart.charAt(0).toUpperCase() + namePart.slice(1));
          showToast(translate('toast_login_success'), 'success');
          resolve(true);
        } else {
          showToast(translate('toast_login_failed'), 'error');
          resolve(false);
        }
      }, 500);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    // No toast on logout, as it's a direct navigation
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
