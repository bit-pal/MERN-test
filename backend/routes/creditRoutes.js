const express = require('express');
const { check } = require('express-validator');
const { 
  getCreditBalance,
  getUserTransactions,
  spendCredits,
  awardCredits,
  dailyLoginCredits
} = require('../controllers/creditController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// User routes
router.get('/balance', getCreditBalance);
router.get('/transactions', getUserTransactions);
router.post('/daily-login', dailyLoginCredits);

router.post('/spend', [
  check('contentId', 'Content ID is required').not().isEmpty(),
  check('reason', 'Reason is required').isIn([
    'premium-content-unlock',
    'event-registration',
    'other'
  ])
], spendCredits);

// Admin routes
router.post('/award', [
  authorize('admin'),
  check('userId', 'User ID is required').not().isEmpty(),
  check('amount', 'Amount must be a positive number').isInt({ min: 1 }),
  check('reason', 'Reason is required').isIn([
    'content-view',
    'content-share',
    'daily-login',
    'admin-bonus',
    'other'
  ]),
  check('description', 'Description is required').not().isEmpty()
], awardCredits);

module.exports = router;