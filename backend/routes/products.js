const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public
 */
router.get('/', productController.getAllProducts);

/**
 * @route   GET /api/products/featured
 * @desc    Get featured products
 * @access  Public
 */
router.get('/featured', productController.getFeaturedProducts);

/**
 * @route   GET /api/products/category/:category
 * @desc    Get products by category
 * @access  Public
 */
router.get('/category/:category', productController.getProductsByCategory);

/**
 * @route   GET /api/products/:id
 * @desc    Get single product
 * @access  Public
 */
router.get('/:id', productController.getProduct);

/**
 * @route   POST /api/products
 * @desc    Create product (Admin)
 * @access  Private/Admin
 */
router.post('/', auth, productController.createProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product (Admin)
 * @access  Private/Admin
 */
router.put('/:id', auth, productController.updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product (Admin)
 * @access  Private/Admin
 */
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;

