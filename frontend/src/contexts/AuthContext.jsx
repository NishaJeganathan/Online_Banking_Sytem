import React, { createContext, useContext, useState, useEffect } from 'react';
import { bankingAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('bankingUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('bankingUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (bankId, credentials) => {
    try {
      const response = await bankingAPI.loginUser(bankId, credentials);
      if (response.user) {
        const userData = {
          ...response.user,
          bankId: bankId,
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('bankingUser', JSON.stringify(userData));
        return { success: true, data: response };
      }
      return { success: false, error: response.message };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (bankId, userData) => {
    try {
      const response = await bankingAPI.registerUser(bankId, userData);
      return { success: true, data: response };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('bankingUser');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
