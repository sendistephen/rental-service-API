const express = require('express');
const { create } = require('../controllers/rental');
const { authorized } = require('../middleware/auth');

const router = express.Router();

router.post('/', authorized, create);

module.exports = router;
