import { useState, useEffect, useCallback } from 'react';
import cartService from '../services/cartService';

/**
 * useCart Hook
 * Manages shopping cart operations
 * @returns {{ cart: Object | null, loading: boolean, error: Error | null, addToCart: Function, updateItem: Function, removeItem: Function, clearCart: Function, refetch: Function }}
 */
export const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      console.error('Cart fetch error:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch cart'));
      // Set empty cart on error (user might not be logged in)
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
    } catch (err) {
      const errorMessage = err.message || 'Failed to add item to cart';
      setError(new Error(errorMessage));
      throw err;
    }
  }, []);

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
    } catch (err) {
      const errorMessage = err.message || 'Failed to update cart item';
      setError(new Error(errorMessage));
      throw err;
    }
  }, []);

  /**
   * Remove item from cart
   * @param {string} itemId - Cart item ID
   */
  const removeItem = useCallback(async (itemId) => {
    try {
      setError(null);
      const data = await cartService.removeFromCart(itemId);
      setCart(data);
    } catch (err) {
      const errorMessage = err.message || 'Failed to remove item from cart';
      setError(new Error(errorMessage));
      throw err;
    }
  }, []);

  /**
   * Clear cart
   */
  const clearCart = useCallback(async () => {
    try {
      setError(null);
      const data = await cartService.clearCart();
      setCart(data);
    } catch (err) {
      const errorMessage = err.message || 'Failed to clear cart';
      setError(new Error(errorMessage));
      throw err;
    }
  }, []);

  return {
    cart,
    loading,
    error,
    addToCart,
    updateItem,
    removeItem,
    clearCart,
    refetch: fetchCart,
  };
};

