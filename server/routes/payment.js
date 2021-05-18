const express = require('express');
const { authorized } = require('../middleware/auth');
const {
  getPendingPayments,
  confirmPayment,
  declinePayment,
} = require('../controllers/payment');

const router = express.Router();

router.get('/', authorized, getPendingPayments);
router.post('/accept', authorized, confirmPayment);
router.post('/decline', authorized, declinePayment);
module.exports = router;
