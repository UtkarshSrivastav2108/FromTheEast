const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');

/**
 * @route   GET /api/announcements
 * @desc    Get active announcement
 * @access  Public
 */
router.get('/', announcementController.getAnnouncement);

module.exports = router;

