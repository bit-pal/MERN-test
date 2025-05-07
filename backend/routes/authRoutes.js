const express = require('express');
const { check } = require('express-validator');
const { 
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  logout
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], register);

router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], login);

router.get('/me', protect, getMe);

router.put('/updatedetails', [
  protect,
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail()
], updateDetails);

router.put('/updatepassword', [
  protect,
  check('currentPassword', 'Current password is required').not().isEmpty(),
  check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], updatePassword);

router.get('/logout', protect, logout);

module.exports = router;