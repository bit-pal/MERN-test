const express = require('express');
const { check } = require('express-validator');
const { 
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getSavedContent,
  getUserTransactions
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Use protection and authorization for all routes
router.use(protect);

// Routes accessible only by admin
router.route('/')
  .get(authorize('admin'), getUsers)
  .post([
    authorize('admin'),
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('role', 'Role must be user, moderator, or admin').isIn(['user', 'moderator', 'admin'])
  ], createUser);

router.route('/:id')
  .get(authorize('admin'), getUser)
  .put([
    authorize('admin'),
    check('name', 'Name is required').optional(),
    check('email', 'Please include a valid email').optional().isEmail(),
    check('role', 'Role must be user, moderator, or admin').optional().isIn(['user', 'moderator', 'admin'])
  ], updateUser)
  .delete(authorize('admin'), deleteUser);

// Routes accessible by the user
router.get('/saved-content', getSavedContent);
router.get('/transactions', getUserTransactions);

module.exports = router;