import { useState, useEffect, useCallback } from 'react';
import orderService from '../services/orderService';

/**
 * useOrders Hook
 * Manages orders
 * @returns {{ orders: Array, loading: boolean, error: Error | null, createOrder: Function, refetch: Function }}
 */
export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch orders'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /**
   * Create order from cart
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>} Created order
   */
  const createOrder = useCallback(async (orderData) => {
    try {
      setError(null);
      const data = await orderService.createOrder(orderData);
      // Refresh orders list
      await fetchOrders();
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to create order';
      setError(new Error(errorMessage));
      throw err;
    }
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    createOrder,
    refetch: fetchOrders,
  };
};

/**
 * useOrder Hook
 * Fetches a single order
 * @param {string} id - Order ID
 * @returns {{ order: Object | null, loading: boolean, error: Error | null, refetch: Function }}
 */
export const useOrder = (id) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getOrder(id);
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch order'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return {
    order,
    loading,
    error,
    refetch: fetchOrder,
  };
};

