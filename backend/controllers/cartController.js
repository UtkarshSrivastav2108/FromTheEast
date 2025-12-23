const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * Get user's cart
 * GET /api/cart
 */
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message,
    });
  }
};

/**
 * Add item to cart
 * POST /api/cart
 */
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    // Get product - handle both numeric IDs and MongoDB ObjectIds
    let product;
    const mongoose = require('mongoose');
    
    // Check if productId is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(productId) && typeof productId === 'string' && productId.length === 24) {
      // Try to find by MongoDB ObjectId
      product = await Product.findById(productId);
    }
    
    // If not found by ObjectId, try to find by numeric ID
    if (!product) {
      const numericId = typeof productId === 'number' ? productId : parseInt(productId, 10);
      if (!isNaN(numericId)) {
        product = await Product.findOne({ id: numericId });
      }
    }
    
    if (!product) {
      console.error('Product not found for productId:', productId, typeof productId);
      return res.status(404).json({
        success: false,
        message: `Product not found with ID: ${productId}. Please make sure products are seeded in the database.`,
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
      });
    }

    // Use product._id (MongoDB ObjectId) for cart items
    const productObjectId = product._id;

    // Check if item already exists in cart
    // Compare using product ObjectId
    const existingItemIndex = cart.items.findIndex((item) => {
      // item.product might be populated (object) or just ObjectId
      const itemProductId = item.product?._id?.toString() || item.product?.toString();
      return itemProductId === productObjectId.toString();
    });

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item - use product._id (MongoDB ObjectId)
      cart.items.push({
        product: productObjectId,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      });
    }

    await cart.save();

    // Populate product before returning
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart,
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message,
    });
  }
};

/**
 * Update cart item quantity
 * PUT /api/cart/:itemId
 */
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: cart,
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message,
    });
  }
};

/**
 * Remove item from cart
 * DELETE /api/cart/:itemId
 */
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== itemId
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart,
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message,
    });
  }
};

/**
 * Clear cart
 * DELETE /api/cart
 */
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: cart,
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message,
    });
  }
};

