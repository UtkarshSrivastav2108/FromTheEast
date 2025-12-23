/**
 * API Client
 * Base configuration for all API calls
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

/**
 * Get authentication token from localStorage
 * @returns {string|null} JWT token or null
 */
const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  // Handle case where token might be stored as JSON string
  if (token) {
    try {
      // Try to parse if it's a JSON string
      const parsed = JSON.parse(token);
      return typeof parsed === 'string' ? parsed : token;
    } catch (e) {
      // Not JSON, return as is
      return token.trim(); // Remove any whitespace
    }
  }
  return null;
};

/**
 * Make API request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      // Clear authentication data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Dispatch custom event to notify AuthContext
      window.dispatchEvent(new CustomEvent('auth:logout'));
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
      
      throw new Error(data.message || 'Session expired. Please login again.');
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    // Handle network errors (connection refused, etc.)
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error instanceof Error ? error : new Error('Network error occurred');
  }
};

/**
 * GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Response data
 */
export const get = async (endpoint, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  return request(url, { method: 'GET' });
};

/**
 * POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} body - Request body
 * @returns {Promise<Object>} Response data
 */
export const post = async (endpoint, body = {}) => {
  return request(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

/**
 * PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} body - Request body
 * @returns {Promise<Object>} Response data
 */
export const put = async (endpoint, body = {}) => {
  return request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

/**
 * DELETE request
 * @param {string} endpoint - API endpoint
 * @returns {Promise<Object>} Response data
 */
export const del = async (endpoint) => {
  return request(endpoint, { method: 'DELETE' });
};

export default {
  get,
  post,
  put,
  delete: del,
};

