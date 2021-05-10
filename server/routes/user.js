const express = require('express');
const { register, signin, activateAccount } = require('../controllers/user');

const router = express.Router();

router.post('/register', register);
router.post('/account-activation', activateAccount);
router.post('/signin', signin);
module.exports = router;
