const express = require('express');
const { create, getRentals, getRental } = require('../controllers/rental');
const { authorized } = require('../middleware/auth');

const router = express.Router();

router.get('/:rentalId', getRental);
router.post('/', authorized, create);
router.get('/', getRentals);

module.exports = router;
