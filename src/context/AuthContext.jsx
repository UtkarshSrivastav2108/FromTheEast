import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import authService from '../services/authService';

/**
 * Authentication Context
 * Manages user authentication state across the application
 */
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Provides authentication state and methods to child components
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutRef = useRef(null);

  /**
   * Logout function
   */
  const logout = useCallback(() => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      throw new Error('Failed to clear authentication data');
    }
  }, []);

  // Store logout in ref for use in useEffect
  logoutRef.current = logout;

  /**
   * Login function
   * @param {Object} userData - User data to store
   * @param {string} token - Authentication token
   */
  const login = useCallback((userData, token) => {
    try {
      // Ensure _id is set for MongoDB compatibility
      const userWithId = {
        ...userData,
        _id: userData._id || userData.id,
      };
      localStorage.setItem('user', JSON.stringify(userWithId));
      localStorage.setItem('authToken', token);
      setUser(userWithId);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error('Failed to save authentication data');
    }
  }, []);

  /**
   * Check authentication status on mount
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = localStorage.getItem('user');
        const authToken = localStorage.getItem('authToken');
        
        if (userData && authToken) {
          // Verify token is still valid by fetching current user
          try {
            const currentUser = await authService.getMe();
            // Ensure _id is set for MongoDB compatibility
            const userWithId = {
              ...currentUser,
              _id: currentUser._id || currentUser.id,
            };
            setUser(userWithId);
            setIsAuthenticated(true);
            // Update localStorage with fresh user data
            localStorage.setItem('user', JSON.stringify(userWithId));
          } catch (error) {
            // Token invalid or expired, clear storage
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for logout events (e.g., from API 401 errors)
    const handleLogout = () => {
      if (logoutRef.current) {
        logoutRef.current();
      }
    };

    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth Hook
 * Custom hook to access authentication context
 * @returns {Object} Authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

