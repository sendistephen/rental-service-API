const express = require('express');
const {
  register,
  signin,
  activateAccount,
  resetPassword,
  forgetPassword,
  getUser,
} = require('../controllers/user');
const { authorized } = require('../middleware/auth');

const router = express.Router();

router.get('/:id', authorized, getUser);
router.post('/register', register);
router.post('/account-activation', activateAccount);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);
router.post('/signin', signin);
module.exports = router;
