const express = require('express');
const {
  create,
  getUserBookings,
  getRecievedBookings,
} = require('../controllers/booking');
const { authorized } = require('../middleware/auth');
const { checkIfUserIsOwnerOfRental } = require('../middleware');

const router = express.Router();

// router.get('/', authorized, getBookings);
router.get('/me', authorized, getUserBookings);
router.get('/recieved', authorized, getRecievedBookings);
router.post('/', authorized, checkIfUserIsOwnerOfRental, create);

module.exports = router;
