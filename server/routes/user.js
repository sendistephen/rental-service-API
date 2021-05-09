const express = require('express');
const { register, signin } = require('../controllers/user');

const router = express.Router();

router.post('/register', register);
router.post('/signin', signin);
module.exports = router;
