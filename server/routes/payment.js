const express = require('express');
const { authorized } = require('../middleware/auth');
const { getPendingPayments, confirmPayment } = require('../controllers/payment');

const router = express.Router();

router.get('/', authorized, getPendingPayments);
router.post('/accept', authorized, confirmPayment);
module.exports = router;
