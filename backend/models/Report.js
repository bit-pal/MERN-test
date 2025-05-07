const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FeedItem',
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true,
    enum: [
      'inappropriate-content',
      'misinformation',
      'spam',
      'offensive',
      'copyright-violation',
      'other'
    ]
  },
  details: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewNote: {
    type: String
  },
  reviewedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for efficient querying
ReportSchema.index({ status: 1, createdAt: 1 });
ReportSchema.index({ content: 1 });
ReportSchema.index({ reportedBy: 1 });

module.exports = mongoose.model('Report', ReportSchema);