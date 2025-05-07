const express = require('express');
const { check } = require('express-validator');
const { 
  getFeedItems,
  getFeedItem,
  createFeedItem,
  updateFeedItem,
  deleteFeedItem,
  saveFeedItem,
  unsaveFeedItem,
  shareFeedItem,
  reportFeedItem,
  syncLinkedInFeed
} = require('../controllers/feedController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/', getFeedItems);
router.get('/:id', getFeedItem);

// Protected routes
router.use(protect);

// User actions
router.post('/:id/save', saveFeedItem);
router.delete('/:id/save', unsaveFeedItem);
router.post('/:id/share', shareFeedItem);
router.post('/:id/report', [
  check('reason', 'Report reason is required').isIn([
    'inappropriate-content',
    'misinformation',
    'spam',
    'offensive',
    'copyright-violation',
    'other'
  ]),
  check('details', 'Details are required when reason is "other"')
    .if((value, { req }) => req.body.reason === 'other')
    .not()
    .isEmpty()
], reportFeedItem);

// Admin routes
router.post('/', [
  authorize('admin', 'moderator'),
  check('title', 'Title is required').not().isEmpty(),
  check('content', 'Content is required').not().isEmpty(),
  check('summary', 'Summary is required').not().isEmpty(),
  check('url', 'Valid URL is required').isURL()
], createFeedItem);

router.put('/:id', [
  authorize('admin', 'moderator'),
  check('title', 'Title is required').optional(),
  check('content', 'Content is required').optional(),
  check('summary', 'Summary is required').optional(),
  check('url', 'Valid URL is required').optional().isURL()
], updateFeedItem);

router.delete('/:id', authorize('admin', 'moderator'), deleteFeedItem);

// LinkedIn feed sync
router.post('/sync-linkedin', authorize('admin'), syncLinkedInFeed);

module.exports = router;