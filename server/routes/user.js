const express = require('express');
const {
  register,
  signin,
  activateAccount,
  resetPassword,
  forgetPassword,
} = require('../controllers/user');

const router = express.Router();

router.post('/register', register);
router.post('/account-activation', activateAccount);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);
router.post('/signin', signin);
module.exports = router;
