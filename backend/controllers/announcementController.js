const Announcement = require('../models/Announcement');

/**
 * Get active announcement
 * GET /api/announcements
 */
exports.getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findOne({ isActive: true })
      .sort({ priority: -1, createdAt: -1 });

    if (!announcement) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No active announcement',
      });
    }

    res.status(200).json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    console.error('Get announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching announcement',
      error: error.message,
    });
  }
};

