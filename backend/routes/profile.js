const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');

// All profile routes require authentication
router.use(auth);

/**
 * @route   GET /api/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/', profileController.getProfile);

/**
 * @route   PUT /api/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/', profileController.updateProfile);

/**
 * @route   PUT /api/profile/password
 * @desc    Change password
 * @access  Private
 */
router.put('/password', profileController.changePassword);

module.exports = router;

