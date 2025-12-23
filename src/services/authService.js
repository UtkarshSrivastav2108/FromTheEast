import api from './api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.firstName - First name
 * @param {string} userData.lastName - Last name
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email
 * @param {string} userData.password - Password
 * @returns {Promise<Object>} User data and token
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  // Extract token and user from response.data.data
  return {
    user: response.data?.data?.user || response.data?.user,
    token: response.data?.data?.token || response.data?.token,
  };
};

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.username - Username or email
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} User data and token
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  // Extract token and user from response.data.data
  return {
    user: response.data?.data?.user || response.data?.user,
    token: response.data?.data?.token || response.data?.token,
  };
};

/**
 * Get current user
 * @returns {Promise<Object>} Current user data
 */
export const getMe = async () => {
  const response = await api.get('/auth/me');
  // Extract user from response.data.data or response.data
  return response.data?.data?.user || response.data?.user || response.data;
};

export default {
  register,
  login,
  getMe,
};

