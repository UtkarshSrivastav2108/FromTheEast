import { useState, useEffect, useCallback } from 'react';
import productService from '../services/productService';

/**
 * useProducts Hook
 * Fetches and manages products
 * @param {Object} [options] - Options
 * @param {string} [options.category] - Filter by category
 * @param {boolean} [options.featured] - Filter featured products
 * @returns {{ products: Array, loading: boolean, error: Error | null, refetch: Function }}
 */
export const useProducts = (options = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (options.category) {
        data = await productService.getProductsByCategory(options.category);
      } else if (options.featured) {
        data = await productService.getFeaturedProducts();
      } else {
        data = await productService.getProducts(options);
      }
      
      // Ensure data is an array
      const productsArray = Array.isArray(data) ? data : (data ? [data] : []);
      setProducts(productsArray);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [options.category, options.featured]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
};

/**
 * useProduct Hook
 * Fetches a single product
 * @param {string} id - Product ID
 * @returns {{ product: Object | null, loading: boolean, error: Error | null, refetch: Function }}
 */
export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProduct(id);
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch product'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
};

