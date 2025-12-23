import { useState, useEffect, useCallback } from 'react';
import wishlistService from '../services/wishlistService';

/**
 * useWishlist Hook
 * Manages wishlist operations
 * @returns {{ wishlist: Object | null, loading: boolean, error: Error | null, addToWishlist: Function, removeFromWishlist: Function, clearWishlist: Function, refetch: Function }}
 */
export const useWishlist = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await wishlistService.getWishlist();
      setWishlist(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch wishlist'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  /**
   * Add item to wishlist
   * @param {Object} itemData - Item data
   * @param {string} itemData.productId - Product ID
   */
  const addToWishlist = useCallback(async (itemData) => {
    try {
      setError(null);
      const data = await wishlistService.addToWishlist(itemData);
      setWishlist(data);
    } catch (err) {
      const errorMessage = err.message || 'Failed to add item to wishlist';
      setError(new Error(errorMessage));
      throw err;
    }
  }, []);

  /**
   * Remove item from wishlist
   * @param {string} itemId - Wishlist item ID
   */
  const removeFromWishlist = useCallback(async (itemId) => {
    try {
      setError(null);
      const data = await wishlistService.removeFromWishlist(itemId);
      setWishlist(data);
    } catch (err) {
      const errorMessage = err.message || 'Failed to remove item from wishlist';
      setError(new Error(errorMessage));
      throw err;
    }
  }, []);

  /**
   * Clear wishlist
   */
  const clearWishlist = useCallback(async () => {
    try {
      setError(null);
      const data = await wishlistService.clearWishlist();
      setWishlist(data);
    } catch (err) {
      const errorMessage = err.message || 'Failed to clear wishlist';
      setError(new Error(errorMessage));
      throw err;
    }
  }, []);

  /**
   * Check if product is in wishlist
   * @param {string} productId - Product ID
   * @returns {boolean} True if product is in wishlist
   */
  const isInWishlist = useCallback((productId) => {
    if (!wishlist || !wishlist.items) return false;
    return wishlist.items.some((item) => item.product._id === productId || item.product === productId);
  }, [wishlist]);

  return {
    wishlist,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    refetch: fetchWishlist,
  };
};

