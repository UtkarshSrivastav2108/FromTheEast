const Product = require('../models/Product');

/**
 * Get all products
 * GET /api/products
 */
exports.getAllProducts = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
    });
  }
};

/**
 * Get single product
 * GET /api/products/:id
 */
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product;
    const mongoose = require('mongoose');
    
    // Check if id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id) && typeof id === 'string' && id.length === 24) {
      // Try to find by MongoDB ObjectId
      product = await Product.findById(id);
    }
    
    // If not found by ObjectId, try to find by numeric ID
    if (!product) {
      const numericId = typeof id === 'number' ? id : parseInt(id, 10);
      if (!isNaN(numericId)) {
        product = await Product.findOne({ id: numericId });
      }
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message,
    });
  }
};

/**
 * Get products by category
 * GET /api/products/category/:category
 */
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
      error: error.message,
    });
  }
};

/**
 * Get featured products
 * GET /api/products/featured
 */
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message,
    });
  }
};

/**
 * Get all categories with metadata
 * GET /api/products/categories
 */
exports.getCategories = async (req, res) => {
  try {
    // Category metadata mapping
    const categoryMetadata = {
      starters: { id: 'starters', name: 'Starters', icon: '🥢' },
      ramen: { id: 'ramen', name: 'Ramen', icon: '🍜' },
      sushi: { id: 'sushi', name: 'Sushi', icon: '🍣' },
      'rice-bowls': { id: 'rice-bowls', name: 'Rice Bowls', icon: '🍚' },
      desserts: { id: 'desserts', name: 'Desserts', icon: '🍮' },
      drinks: { id: 'drinks', name: 'Drinks', icon: '🥤' },
    };

    // Get unique categories from products
    const categories = await Product.distinct('category');
    
    // Map to include metadata
    const categoriesWithMetadata = categories
      .filter(cat => categoryMetadata[cat])
      .map(cat => categoryMetadata[cat]);

    res.status(200).json({
      success: true,
      count: categoriesWithMetadata.length,
      data: categoriesWithMetadata,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    });
  }
};

/**
 * Create product (Admin only)
 * POST /api/products
 */
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message,
    });
  }
};

/**
 * Update product (Admin only)
 * PUT /api/products/:id
 */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message,
    });
  }
};

/**
 * Delete product (Admin only)
 * DELETE /api/products/:id
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message,
    });
  }
};

