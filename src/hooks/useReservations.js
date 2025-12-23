import { useState, useEffect, useCallback } from 'react';
import reservationService from '../services/reservationService';

/**
 * useReservations Hook
 * Manages reservations
 * @returns {{ reservations: Array, loading: boolean, error: Error | null, createReservation: Function, updateReservation: Function, cancelReservation: Function, refetch: Function }}
 */
export const useReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reservationService.getReservations();
      setReservations(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch reservations'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  /**
   * Create reservation
   * @param {Object} reservationData - Reservation data
   * @returns {Promise<Object>} Created reservation
   */
  const createReservation = useCallback(async (reservationData) => {
    try {
      setError(null);
      const data = await reservationService.createReservation(reservationData);
      // Refresh reservations list
      await fetchReservations();
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to create reservation';
      setError(new Error(errorMessage));
      throw err;
    }
  }, [fetchReservations]);

  /**
   * Update reservation
   * @param {string} id - Reservation ID
   * @param {Object} reservationData - Updated reservation data
   * @returns {Promise<Object>} Updated reservation
   */
  const updateReservation = useCallback(async (id, reservationData) => {
    try {
      setError(null);
      const data = await reservationService.updateReservation(id, reservationData);
      // Refresh reservations list
      await fetchReservations();
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update reservation';
      setError(new Error(errorMessage));
      throw err;
    }
  }, [fetchReservations]);

  /**
   * Cancel reservation
   * @param {string} id - Reservation ID
   * @returns {Promise<Object>} Cancelled reservation
   */
  const cancelReservation = useCallback(async (id) => {
    try {
      setError(null);
      const data = await reservationService.cancelReservation(id);
      // Refresh reservations list
      await fetchReservations();
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to cancel reservation';
      setError(new Error(errorMessage));
      throw err;
    }
  }, [fetchReservations]);

  return {
    reservations,
    loading,
    error,
    createReservation,
    updateReservation,
    cancelReservation,
    refetch: fetchReservations,
  };
};

/**
 * useReservation Hook
 * Fetches a single reservation
 * @param {string} id - Reservation ID
 * @returns {{ reservation: Object | null, loading: boolean, error: Error | null, refetch: Function }}
 */
export const useReservation = (id) => {
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservation = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await reservationService.getReservation(id);
      setReservation(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch reservation'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReservation();
  }, [fetchReservation]);

  return {
    reservation,
    loading,
    error,
    refetch: fetchReservation,
  };
};

