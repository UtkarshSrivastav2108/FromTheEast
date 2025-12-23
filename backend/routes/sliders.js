const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/sliderController');

/**
 * @route   GET /api/sliders
 * @desc    Get all active slider items
 * @access  Public
 */
router.get('/', sliderController.getSliders);

module.exports = router;

