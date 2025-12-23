const Reservation = require('../models/Reservation');

/**
 * Get user's reservations
 * GET /api/reservations
 */
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .sort({ date: -1, time: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reservations',
      error: error.message,
    });
  }
};

/**
 * Get single reservation
 * GET /api/reservations/:id
 */
exports.getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    console.error('Get reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reservation',
      error: error.message,
    });
  }
};

/**
 * Create reservation
 * POST /api/reservations
 */
exports.createReservation = async (req, res) => {
  try {
    const { name, email, phone, guests, date, time, specialRequests } = req.body;

    // Validation
    if (!name || !email || !phone || !guests || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if date is in the past
    const reservationDate = new Date(date);
    if (reservationDate < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({
        success: false,
        message: 'Reservation date cannot be in the past',
      });
    }

    // Create reservation
    const reservation = await Reservation.create({
      user: req.user.id,
      name,
      email,
      phone,
      guests,
      date: reservationDate,
      time,
      specialRequests,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: reservation,
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating reservation',
      error: error.message,
    });
  }
};

/**
 * Update reservation
 * PUT /api/reservations/:id
 */
exports.updateReservation = async (req, res) => {
  try {
    const { name, email, phone, guests, date, time, specialRequests } = req.body;

    const reservation = await Reservation.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    // Update fields
    if (name) reservation.name = name;
    if (email) reservation.email = email;
    if (phone) reservation.phone = phone;
    if (guests) reservation.guests = guests;
    if (date) reservation.date = new Date(date);
    if (time) reservation.time = time;
    if (specialRequests !== undefined) reservation.specialRequests = specialRequests;

    await reservation.save();

    res.status(200).json({
      success: true,
      message: 'Reservation updated successfully',
      data: reservation,
    });
  } catch (error) {
    console.error('Update reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating reservation',
      error: error.message,
    });
  }
};

/**
 * Cancel reservation
 * DELETE /api/reservations/:id
 */
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.status(200).json({
      success: true,
      message: 'Reservation cancelled successfully',
      data: reservation,
    });
  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling reservation',
      error: error.message,
    });
  }
};

