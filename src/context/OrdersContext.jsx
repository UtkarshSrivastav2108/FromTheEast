import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const OrdersContext = createContext();

/**
 * Orders Context Provider
 * Manages orders state and operations with localStorage persistence
 */
export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Error loading orders from localStorage:', error);
        setOrders([]);
      }
    }
  }, []);

  // Save orders to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  /**
   * Create a new order
   * @param {Object} orderData - Order data including items, total, etc.
   * @returns {string} Order ID
   */
  const createOrder = useCallback((orderData) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'processing',
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      deliveryFee: orderData.deliveryFee || 0,
      discount: orderData.discount || 0,
      total: orderData.total || 0,
      address: orderData.address || {},
      paymentMethod: orderData.paymentMethod || 'card',
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    return newOrder.id;
  }, []);

  /**
   * Get order by ID
   * @param {string} orderId - Order ID
   * @returns {Object|null} Order object or null
   */
  const getOrder = useCallback((orderId) => {
    return orders.find((order) => order.id === orderId) || null;
  }, [orders]);

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   */
  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  }, []);

  const value = {
    orders,
    createOrder,
    getOrder,
    updateOrderStatus,
  };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

/**
 * Hook to use orders context
 * @returns {Object} Orders context value
 */
export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

