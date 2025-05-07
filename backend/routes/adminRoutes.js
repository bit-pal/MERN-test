const express = require('express');
const { check } = require('express-validator');
const { 
  getDashboardStats,
  getReports,
  reviewReport,
  getCreditStats,
  getContentStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Protect all routes and restrict to admin
router.use(protect);
router.use(authorize('admin', 'moderator'));

// Dashboard
router.get('/stats', getDashboardStats);

// Reports
router.get('/reports', getReports);
router.put('/reports/:id/review', [
  check('status', 'Status must be reviewed, accepted, or rejected')
    .isIn(['reviewed', 'accepted', 'rejected']),
  check('reviewNote', 'Review note is required').not().isEmpty()
], reviewReport);

// Credit system stats
router.get('/credit-stats', getCreditStats);

// Content stats
router.get('/content-stats', getContentStats);

module.exports = router;