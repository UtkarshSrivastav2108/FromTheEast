import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const WishlistContext = createContext();

/**
 * Wishlist Context Provider
 * Manages wishlist state and operations with localStorage persistence
 */
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
        setWishlistItems([]);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  /**
   * Add item to wishlist
   * @param {Object} item - Menu item to add
   */
  const addToWishlist = useCallback((item) => {
    setWishlistItems((prevItems) => {
      const existingItem = prevItems.find((wishlistItem) => wishlistItem.id === item.id);
      if (existingItem) {
        return prevItems; // Already in wishlist
      }
      return [...prevItems, item];
    });
  }, []);

  /**
   * Remove item from wishlist
   * @param {number} itemId - ID of item to remove
   */
  const removeFromWishlist = useCallback((itemId) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  /**
   * Check if item is in wishlist
   * @param {number} itemId - ID of item to check
   * @returns {boolean} True if item is in wishlist
   */
  const isInWishlist = useCallback((itemId) => {
    return wishlistItems.some((item) => item.id === itemId);
  }, [wishlistItems]);

  /**
   * Clear entire wishlist
   */
  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  /**
   * Get total number of items in wishlist
   */
  const getWishlistCount = useCallback(() => {
    return wishlistItems.length;
  }, [wishlistItems]);

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

/**
 * Hook to use wishlist context
 * @returns {Object} Wishlist context value
 */
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

