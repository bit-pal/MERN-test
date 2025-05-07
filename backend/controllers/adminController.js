const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const FeedItem = require('../models/FeedItem');
const CreditTransaction = require('../models/Credit');
const Report = require('../models/Report');
const { validationResult } = require('express-validator');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get counts
    const userCount = await User.countDocuments();
    const contentCount = await FeedItem.countDocuments();
    const pendingReportsCount = await Report.countDocuments({ status: 'pending' });
    
    // Get top saved content
    const topSavedContent = await FeedItem.find()
      .sort({ saveCount: -1 })
      .limit(5);
    
    // Get most active users (by credit transactions)
    const mostActiveUsers = await CreditTransaction.aggregate([
      {
        $group: {
          _id: '$user',
          totalTransactions: { $sum: 1 },
          totalCreditsEarned: {
            $sum: {
              $cond: [{ $eq: ['$type', 'earn'] }, '$amount', 0]
            }
          }
        }
      },
      { $sort: { totalTransactions: -1 } },
      { $limit: 5 }
    ]);
    
    // Get user IDs
    const userIds = mostActiveUsers.map(item => item._id);
    
    // Get user details
    const userDetails = await User.find({ _id: { $in: userIds } })
      .select('name email');
    
    // Combine user details with activity data
    const activeUsers = mostActiveUsers.map(item => {
      const user = userDetails.find(u => u._id.toString() === item._id.toString());
      return {
        ...item,
        name: user ? user.name : 'Unknown',
        email: user ? user.email : 'Unknown'
      };
    });

    res.status(200).json({
      success: true,
      data: {
        counts: {
          users: userCount,
          content: contentCount,
          pendingReports: pendingReportsCount
        },
        topSavedContent,
        mostActiveUsers: activeUsers
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all pending reports
// @route   GET /api/admin/reports
// @access  Private/Admin
exports.getReports = async (req, res, next) => {
  try {
    const filter = {};
    
    // Filter by status if provided
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Report.countDocuments(filter);

    // Query with pagination
    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('content', 'title url')
      .populate('reportedBy', 'name')
      .populate('reviewedBy', 'name');

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
      count: reports.length,
      pagination,
      data: reports
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Review a report
// @route   PUT /api/admin/reports/:id/review
// @access  Private/Admin
exports.reviewReport = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { status, reviewNote } = req.body;

    let report = await Report.findById(req.params.id);

    if (!report) {
      return next(
        new ErrorResponse(`Report not found with id of ${req.params.id}`, 404)
      );
    }

    // Update report
    report.status = status;
    report.reviewNote = reviewNote;
    report.reviewedBy = req.user.id;
    report.reviewedAt = Date.now();
    
    await report.save();

    // If report is accepted, deactivate the content
    if (status === 'accepted') {
      await FeedItem.findByIdAndUpdate(report.content, {
        isActive: false
      });
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user credit system stats
// @route   GET /api/admin/credit-stats
// @access  Private/Admin
exports.getCreditStats = async (req, res, next) => {
  try {
    // Total credits in circulation
    const totalCredits = await User.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$credits' }
        }
      }
    ]);

    // Credits earned by reason
    const creditsByReason = await CreditTransaction.aggregate([
      {
        $match: { type: 'earn' }
      },
      {
        $group: {
          _id: '$reason',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    // Credits spent by reason
    const spentByReason = await CreditTransaction.aggregate([
      {
        $match: { type: 'spend' }
      },
      {
        $group: {
          _id: '$reason',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCreditsInCirculation: totalCredits.length > 0 ? totalCredits[0].total : 0,
        creditsByReason,
        spentByReason
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get content performance stats
// @route   GET /api/admin/content-stats
// @access  Private/Admin
exports.getContentStats = async (req, res, next) => {
  try {
    // Top performing content
    const topContent = await FeedItem.find()
      .sort({ viewCount: -1 })
      .limit(10)
      .select('title viewCount saveCount shareCount reportCount');

    // Content by source
    const contentBySource = await FeedItem.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Premium content performance
    const premiumContentStats = await FeedItem.aggregate([
      {
        $match: { isPremium: true }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          avgViews: { $avg: '$viewCount' },
          avgSaves: { $avg: '$saveCount' },
          totalRevenue: { $sum: '$premiumCost' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        topContent,
        contentBySource,
        premiumContent: premiumContentStats.length > 0 ? premiumContentStats[0] : {
          count: 0,
          avgViews: 0,
          avgSaves: 0,
          totalRevenue: 0
        }
      }
    });
  } catch (err) {
    next(err);
  }
};