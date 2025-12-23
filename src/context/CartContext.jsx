import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import cartService from '../services/cartService';
import { useSnackbar } from './SnackbarContext';

const CartContext = createContext();

/**
 * Cart Context Provider
 * Manages cart state and operations using API
 */
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useSnackbar();

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.getCart();
      // Ensure we have the cart object with items array
      if (data && !data.items && data.data) {
        setCart(data.data);
      } else {
        setCart(data);
      }
    } catch (err) {
      // 401 errors are expected when user is not logged in - don't log as error
      const isUnauthorized = err.message && err.message.includes('authorization');
      // Connection errors are expected when backend is not running - don't log as error
      const isConnectionError = err.message && (
        err.message.includes('Failed to fetch') || 
        err.message.includes('Unable to connect')
      );
      
      if (!isUnauthorized && !isConnectionError) {
        console.error('Cart fetch error:', err);
      }
      setError(err instanceof Error ? err : new Error('Failed to fetch cart'));
      // Set empty cart on error (user might not be logged in or backend is down)
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /**
   * Add item to cart
   * @param {Object} itemData - Item data
   * @param {string} itemData.productId - Product ID
   * @param {number} [itemData.quantity=1] - Quantity
   */
  const addToCart = useCallback(async (itemData) => {
    try {
      setError(null);
      const data = await cartService.addToCart(itemData);
      setCart(data);
      showSuccess('Item added to cart successfully!');
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to add item to cart';
      setError(new Error(errorMessage));
      showError(errorMessage);
      throw err;
    }
  }, [showSuccess, showError]);

  /**
   * Update cart item quantity
   * @param {string} itemId - Cart item ID
   * @param {number} quantity - New quantity
   */
  const updateItem = useCallback(async (itemId, quantity) => {
    try {
      setError(null);
      const data = await cartService.updateCartItem(itemId, quantity);
      setCart(data);
      showSuccess('Cart updated successfully!');
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update cart item';
      setError(new Error(errorMessage));
      showError(errorMessage);
      throw err;
    }
  }, [showSuccess, showError]);

  /**
   * Remove item from cart
   * @param {string} itemId - Cart item ID
   */
  const removeItem = useCallback(async (itemId) => {
    try {
      setError(null);
      const data = await cartService.removeFromCart(itemId);
      setCart(data);
      showSuccess('Item removed from cart');
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to remove item from cart';
      setError(new Error(errorMessage));
      showError(errorMessage);
      throw err;
    }
  }, [showSuccess, showError]);

  /**
   * Clear cart
   */
  const clearCart = useCallback(async () => {
    try {
      setError(null);
      const data = await cartService.clearCart();
      setCart(data);
      showSuccess('Cart cleared successfully');
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to clear cart';
      setError(new Error(errorMessage));
      showError(errorMessage);
      throw err;
    }
  }, [showSuccess, showError]);

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateItem,
    removeItem,
    clearCart,
    refetch: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/**
 * Hook to use cart context
 * @returns {Object} Cart context value
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
