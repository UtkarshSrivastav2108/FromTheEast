import api from './api';

/**
 * Reservation Service
 * Handles all reservation-related API calls
 */

/**
 * Get user's reservations
 * @returns {Promise<Array>} Array of reservations
 */
export const getReservations = async () => {
  const response = await api.get('/reservations');
  return response.data;
};

/**
 * Get single reservation
 * @param {string} id - Reservation ID
 * @returns {Promise<Object>} Reservation data
 */
export const getReservation = async (id) => {
  const response = await api.get(`/reservations/${id}`);
  return response.data;
};

/**
 * Create reservation
 * @param {Object} reservationData - Reservation data
 * @param {string} reservationData.name - Name
 * @param {string} reservationData.email - Email
 * @param {string} reservationData.phone - Phone number
 * @param {number} reservationData.guests - Number of guests
 * @param {string} reservationData.date - Reservation date
 * @param {string} reservationData.time - Reservation time
 * @param {string} [reservationData.specialRequests] - Special requests
 * @returns {Promise<Object>} Created reservation data
 */
export const createReservation = async (reservationData) => {
  const response = await api.post('/reservations', reservationData);
  return response.data;
};

/**
 * Update reservation
 * @param {string} id - Reservation ID
 * @param {Object} reservationData - Updated reservation data
 * @returns {Promise<Object>} Updated reservation data
 */
export const updateReservation = async (id, reservationData) => {
  const response = await api.put(`/reservations/${id}`, reservationData);
  return response.data;
};

/**
 * Cancel reservation
 * @param {string} id - Reservation ID
 * @returns {Promise<Object>} Cancelled reservation data
 */
export const cancelReservation = async (id) => {
  const response = await api.delete(`/reservations/${id}`);
  return response.data;
};

export default {
  getReservations,
  getReservation,
  createReservation,
  updateReservation,
  cancelReservation,
};

