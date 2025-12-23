const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const auth = require('../middleware/auth');

// All wishlist routes require authentication
router.use(auth);

/**
 * @route   GET /api/wishlist
 * @desc    Get user's wishlist
 * @access  Private
 */
router.get('/', wishlistController.getWishlist);

/**
 * @route   POST /api/wishlist
 * @desc    Add item to wishlist
 * @access  Private
 */
router.post('/', wishlistController.addToWishlist);

/**
 * @route   DELETE /api/wishlist/:itemId
 * @desc    Remove item from wishlist
 * @access  Private
 */
router.delete('/:itemId', wishlistController.removeFromWishlist);

/**
 * @route   DELETE /api/wishlist
 * @desc    Clear wishlist
 * @access  Private
 */
router.delete('/', wishlistController.clearWishlist);

module.exports = router;

