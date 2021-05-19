const express = require('express');
const {
  create,
  getUserBookings,
  getRecievedBookings,
  deleteBooking,
} = require('../controllers/booking');
const { authorized } = require('../middleware/auth');
const { checkIfUserIsOwnerOfRental, checkObjectId } = require('../middleware');

const router = express.Router();

// router.get('/', authorized, getBookings);
router.get('/me', authorized, getUserBookings);
router.get('/recieved', authorized, getRecievedBookings);
router.delete(
  '/:bookingID',
  [authorized, checkObjectId('bookingID')],
  deleteBooking
);
router.post('/', authorized, checkIfUserIsOwnerOfRental, create);

module.exports = router;
