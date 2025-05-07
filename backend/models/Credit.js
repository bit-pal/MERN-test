const mongoose = require('mongoose');

const CreditTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['earn', 'spend'],
    required: true
  },
  reason: {
    type: String,
    required: true,
    enum: [
      'content-view', 
      'content-share', 
      'daily-login', 
      'premium-content-unlock', 
      'event-registration',
      'other'
    ]
  },
  description: {
    type: String
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FeedItem'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for quick lookup of user transactions
CreditTransactionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('CreditTransaction', CreditTransactionSchema);