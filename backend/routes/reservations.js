const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const auth = require('../middleware/auth');

// All reservation routes require authentication
router.use(auth);

/**
 * @route   GET /api/reservations
 * @desc    Get user's reservations
 * @access  Private
 */
router.get('/', reservationController.getReservations);

/**
 * @route   GET /api/reservations/:id
 * @desc    Get single reservation
 * @access  Private
 */
router.get('/:id', reservationController.getReservation);

/**
 * @route   POST /api/reservations
 * @desc    Create reservation
 * @access  Private
 */
router.post('/', reservationController.createReservation);

/**
 * @route   PUT /api/reservations/:id
 * @desc    Update reservation
 * @access  Private
 */
router.put('/:id', reservationController.updateReservation);

/**
 * @route   DELETE /api/reservations/:id
 * @desc    Cancel reservation
 * @access  Private
 */
router.delete('/:id', reservationController.cancelReservation);

module.exports = router;

