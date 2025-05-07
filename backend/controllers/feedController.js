const ErrorResponse = require('../utils/errorResponse');
const FeedItem = require('../models/FeedItem');
const User = require('../models/User');
const Report = require('../models/Report');
const CreditTransaction = require('../models/Credit');
const { validationResult } = require('express-validator');
const axios = require('axios');

// @desc    Get all feed items (with filtering, sorting, and pagination)
// @route   GET /api/feed
// @access  Public
exports.getFeedItems = async (req, res, next) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude from filtering
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Delete these fields from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Only show active items to regular users
    let query = FeedItem.find(JSON.parse(queryStr)).where('isActive').equals(true);

    // Select specific fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await FeedItem.countDocuments(JSON.parse(queryStr)).where('isActive').equals(true);

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const feedItems = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: feedItems.length,
      pagination,
      data: feedItems
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single feed item
// @route   GET /api/feed/:id
// @access  Public
exports.getFeedItem = async (req, res, next) => {
  try {
    const feedItem = await FeedItem.findById(req.params.id);

    if (!feedItem) {
      return next(
        new ErrorResponse(`Feed item not found with id of ${req.params.id}`, 404)
      );
    }

    // If item is not active and user is not admin or moderator, don't show it
    if (!feedItem.isActive && req.user && req.user.role !== 'admin' && req.user.role !== 'moderator') {
      return next(
        new ErrorResponse(`Feed item not found with id of ${req.params.id}`, 404)
      );
    }

    // Increment view count
    feedItem.viewCount += 1;
    await feedItem.save();

    // If user is authenticated, award credits for viewing
    if (req.user) {
      await awardCreditsForView(req.user.id, feedItem._id);
    }

    res.status(200).json({
      success: true,
      data: feedItem
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new feed item (manual creation for admins)
// @route   POST /api/feed
// @access  Private/Admin
exports.createFeedItem = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Add source as manual
    req.body.source = 'manual';
    
    const feedItem = await FeedItem.create(req.body);

    res.status(201).json({
      success: true,
      data: feedItem
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update feed item
// @route   PUT /api/feed/:id
// @access  Private/Admin
exports.updateFeedItem = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    let feedItem = await FeedItem.findById(req.params.id);

    if (!feedItem) {
      return next(
        new ErrorResponse(`Feed item not found with id of ${req.params.id}`, 404)
      );
    }

    // Update the item
    req.body.updatedAt = Date.now();
    feedItem = await FeedItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: feedItem
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete feed item
// @route   DELETE /api/feed/:id
// @access  Private/Admin
exports.deleteFeedItem = async (req, res, next) => {
  try {
    const feedItem = await FeedItem.findById(req.params.id);

    if (!feedItem) {
      return next(
        new ErrorResponse(`Feed item not found with id of ${req.params.id}`, 404)
      );
    }

    await feedItem.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Save feed item for later
// @route   POST /api/feed/:id/save
// @access  Private
exports.saveFeedItem = async (req, res, next) => {
  try {
    const feedItem = await FeedItem.findById(req.params.id);

    if (!feedItem) {
      return next(
        new ErrorResponse(`Feed item not found with id of ${req.params.id}`, 404)
      );
    }

    const user = await User.findById(req.user.id);

    // Check if already saved
    if (user.savedContent.includes(req.params.id)) {
      return next(
        new ErrorResponse(`Feed item already saved`, 400)
      );
    }

    // Add to saved content
    user.savedContent.push(req.params.id);
    await user.save();

    // Increment save count
    feedItem.saveCount += 1;
    await feedItem.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove feed item from saved
// @route   DELETE /api/feed/:id/save
// @access  Private
exports.unsaveFeedItem = async (req, res, next) => {
  try {
    const feedItem = await FeedItem.findById(req.params.id);

    if (!feedItem) {
      return next(
        new ErrorResponse(`Feed item not found with id of ${req.params.id}`, 404)
      );
    }

    const user = await User.findById(req.user.id);

    // Check if already saved
    if (!user.savedContent.includes(req.params.id)) {
      return next(
        new ErrorResponse(`Feed item not saved`, 400)
      );
    }

    // Remove from saved content
    user.savedContent = user.savedContent.filter(
      item => item.toString() !== req.params.id
    );
    await user.save();

    // Decrement save count
    feedItem.saveCount = Math.max(0, feedItem.saveCount - 1);
    await feedItem.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Share feed item
// @route   POST /api/feed/:id/share
// @access  Private
exports.shareFeedItem = async (req, res, next) => {
  try {
    const feedItem = await FeedItem.findById(req.params.id);

    if (!feedItem) {
      return next(
        new ErrorResponse(`Feed item not found with id of ${req.params.id}`, 404)
      );
    }

    // Increment share count
    feedItem.shareCount += 1;
    await feedItem.save();

    // Award credits for sharing
    await awardCreditsForShare(req.user.id, feedItem._id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Report feed item
// @route   POST /api/feed/:id/report
// @access  Private
exports.reportFeedItem = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const feedItem = await FeedItem.findById(req.params.id);

    if (!feedItem) {
      return next(
        new ErrorResponse(`Feed item not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if already reported by this user
    const existingReport = await Report.findOne({
      content: req.params.id,
      reportedBy: req.user.id
    });

    if (existingReport) {
      return next(
        new ErrorResponse(`You have already reported this item`, 400)
      );
    }

    // Create report
    const report = await Report.create({
      content: req.params.id,
      reportedBy: req.user.id,
      reason: req.body.reason,
      details: req.body.details
    });

    // Increment report count
    feedItem.reportCount += 1;
    await feedItem.save();

    res.status(201).json({
      success: true,
      data: report
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Fetch LinkedIn feeds and store in database
// @route   POST /api/feed/sync-linkedin
// @access  Private/Admin
exports.syncLinkedInFeed = async (req, res, next) => {
  try {
    // This would typically use LinkedIn API credentials from environment variables
    const apiKey = process.env.LINKEDIN_API_KEY;
    
    if (!apiKey) {
      return next(
        new ErrorResponse('LinkedIn API key not configured', 500)
      );
    }

    // For demonstration purposes, we'll create mock LinkedIn data
    // In a real implementation, you would fetch from LinkedIn's API
    const mockLinkedInPosts = [
      {
        title: 'Building Scalable Web Applications',
        content: 'Learn how to build scalable web applications using modern technologies.',
        summary: 'A comprehensive guide to scalable architecture',
        url: 'https://linkedin.com/post/123456',
        imageUrl: 'https://example.com/images/scalable-apps.jpg',
        author: 'John Developer',
        publishedAt: new Date(),
        sourceId: 'linkedin-123456',
        tags: ['web development', 'scalability', 'architecture']
      },
      {
        title: 'The Future of Machine Learning',
        content: 'Exploring the latest trends and future directions in machine learning.',
        summary: 'ML trends and predictions for the next decade',
        url: 'https://linkedin.com/post/789012',
        imageUrl: 'https://example.com/images/machine-learning.jpg',
        author: 'AI Researcher',
        publishedAt: new Date(),
        sourceId: 'linkedin-789012',
        tags: ['machine learning', 'AI', 'technology trends']
      }
    ];

    // Process and store each post
    const savedPosts = [];
    for (const post of mockLinkedInPosts) {
      // Check if already exists by sourceId
      const existingPost = await FeedItem.findOne({
        source: 'linkedin',
        sourceId: post.sourceId
      });

      if (!existingPost) {
        // Create new feed item
        const feedItem = await FeedItem.create({
          title: post.title,
          content: post.content,
          summary: post.summary,
          source: 'linkedin',
          sourceId: post.sourceId,
          url: post.url,
          imageUrl: post.imageUrl,
          author: post.author,
          publishedAt: post.publishedAt,
          tags: post.tags
        });
        
        savedPosts.push(feedItem);
      }
    }

    res.status(200).json({
      success: true,
      count: savedPosts.length,
      data: savedPosts
    });
  } catch (err) {
    next(err);
  }
};

// Helper function to award credits for viewing content
const awardCreditsForView = async (userId, contentId) => {
  // Check if user has already received credits for this content
  const existingTransaction = await CreditTransaction.findOne({
    user: userId,
    contentId: contentId,
    reason: 'content-view'
  });

  if (existingTransaction) {
    return;
  }

  // Award credits
  const creditAmount = 5;
  
  // Create transaction record
  await CreditTransaction.create({
    user: userId,
    amount: creditAmount,
    type: 'earn',
    reason: 'content-view',
    contentId: contentId,
    description: 'Credits earned for viewing content'
  });

  // Update user's credit balance
  await User.findByIdAndUpdate(userId, {
    $inc: { credits: creditAmount }
  });
};

// Helper function to award credits for sharing content
const awardCreditsForShare = async (userId, contentId) => {
  // Award credits
  const creditAmount = 10;
  
  // Create transaction record
  await CreditTransaction.create({
    user: userId,
    amount: creditAmount,
    type: 'earn',
    reason: 'content-share',
    contentId: contentId,
    description: 'Credits earned for sharing content'
  });

  // Update user's credit balance
  await User.findByIdAndUpdate(userId, {
    $inc: { credits: creditAmount }
  });
};