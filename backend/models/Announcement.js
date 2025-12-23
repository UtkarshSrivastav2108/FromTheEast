const mongoose = require('mongoose');

/**
 * Announcement Schema
 */
const announcementSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Announcement message is required'],
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  priority: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

/**
 * Index for active announcements
 */
announcementSchema.index({ isActive: 1, priority: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);

