const express = require('express');
const { create, getRentals } = require('../controllers/rental');
const { authorized } = require('../middleware/auth');

const router = express.Router();

router.post('/', authorized, create);
router.get('/', getRentals);

module.exports = router;
