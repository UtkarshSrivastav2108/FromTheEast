import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

/**
 * useAuth Hook
 * Handles authentication operations
 * @returns {{ login: Function, register: Function, logout: Function, loading: boolean, error: Error | null }}
 */
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.username - Username or email
   * @param {string} credentials.password - Password
   * @returns {Promise<Object>} User data and token
   */
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const { user, token } = await authService.login(credentials);
      
      // Store token and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user, token };
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(new Error(errorMessage));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Register user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} User data and token
   */
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const { user, token } = await authService.register(userData);
      
      // Store token and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user, token };
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(new Error(errorMessage));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/');
  }, [navigate]);

  return {
    login,
    register,
    logout,
    loading,
    error,
  };
};

