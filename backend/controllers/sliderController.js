const Slider = require('../models/Slider');

/**
 * Get all active slider items
 * GET /api/sliders
 */
exports.getSliders = async (req, res) => {
  try {
    const sliders = await Slider.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sliders.length,
      data: sliders,
    });
  } catch (error) {
    console.error('Get sliders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sliders',
      error: error.message,
    });
  }
};

