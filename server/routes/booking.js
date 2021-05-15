const express = require('express');
const { create } = require('../controllers/booking');
const { authorized } = require('../middleware/auth');
const { checkIfUserIsOwnerOfRental } = require('../middleware');

const router = express.Router();

router.post('/', authorized, checkIfUserIsOwnerOfRental, create);

module.exports = router;
