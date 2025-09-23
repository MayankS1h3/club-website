import { createContext, useContext, useState, useEffect } from 'react';
import { adminAuth } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if admin is already logged in on app load
  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await adminAuth.getProfile();
      setAdmin(response.admin);
    } catch (error) {
      // Admin not logged in or token expired
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await adminAuth.login(credentials);
      setAdmin(response.admin);
      return { success: true, admin: response.admin };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await adminAuth.logout();
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error('Logout error:', error);
    } finally {
      setAdmin(null);
    }
  };

  const value = {
    admin,
    isLoading,
    login,
    logout,
    isAuthenticated: !!admin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};