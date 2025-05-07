const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const CreditTransaction = require('../models/Credit');
const FeedItem = require('../models/FeedItem');
const { validationResult } = require('express-validator');

// @desc    Get user credit balance
// @route   GET /api/credits/balance
// @access  Private
exports.getCreditBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('credits');

    res.status(200).json({
      success: true,
      data: {
        credits: user.credits
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all transactions for a user
// @route   GET /api/credits/transactions
// @access  Private
exports.getUserTransactions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await CreditTransaction.countDocuments({ user: req.user.id });

    // Query with pagination
    const transactions = await CreditTransaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('contentId', 'title');

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
      count: transactions.length,
      pagination,
      data: transactions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Spend credits to unlock premium content
// @route   POST /api/credits/spend
// @access  Private
exports.spendCredits = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { contentId, reason } = req.body;

    // Verify content exists and is premium
    const content = await FeedItem.findById(contentId);
    
    if (!content) {
      return next(new ErrorResponse(`Content not found with id of ${contentId}`, 404));
    }

    if (!content.isPremium) {
      return next(new ErrorResponse('This content is not premium', 400));
    }

    // Get credit cost
    const creditCost = content.premiumCost;

    // Check if user has enough credits
    const user = await User.findById(req.user.id);
    
    if (user.credits < creditCost) {
      return next(new ErrorResponse('Insufficient credits', 400));
    }

    // Create transaction record
    const transaction = await CreditTransaction.create({
      user: req.user.id,
      amount: creditCost,
      type: 'spend',
      reason: reason || 'premium-content-unlock',
      contentId: contentId,
      description: `Credits spent to unlock premium content: ${content.title}`
    });

    // Update user's credit balance
    user.credits -= creditCost;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        transaction,
        remainingCredits: user.credits
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Award credits (admin only)
// @route   POST /api/credits/award
// @access  Private/Admin
exports.awardCredits = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { userId, amount, reason, description } = req.body;

    // Verify user exists
    const user = await User.findById(userId);
    
    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${userId}`, 404));
    }

    // Create transaction record
    const transaction = await CreditTransaction.create({
      user: userId,
      amount,
      type: 'earn',
      reason,
      description
    });

    // Update user's credit balance
    user.credits += amount;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        transaction,
        newCreditBalance: user.credits
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get daily login credits
// @route   POST /api/credits/daily-login
// @access  Private
exports.dailyLoginCredits = async (req, res, next) => {
  try {
    // Check if user has already received daily login credits today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingTransaction = await CreditTransaction.findOne({
      user: req.user.id,
      reason: 'daily-login',
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (existingTransaction) {
      return next(new ErrorResponse('Daily login credits already claimed today', 400));
    }

    // Award credits
    const creditAmount = 20;
    
    // Create transaction record
    const transaction = await CreditTransaction.create({
      user: req.user.id,
      amount: creditAmount,
      type: 'earn',
      reason: 'daily-login',
      description: 'Credits earned for daily login'
    });

    // Update user's credit balance
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { credits: creditAmount } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: {
        transaction,
        newCreditBalance: user.credits
      }
    });
  } catch (err) {
    next(err);
  }
};