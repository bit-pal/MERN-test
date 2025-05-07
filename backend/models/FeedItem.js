const mongoose = require('mongoose');

const FeedItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true,
    enum: ['linkedin', 'manual', 'other']
  },
  sourceId: {
    type: String
  },
  url: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  author: {
    type: String
  },
  publishedAt: {
    type: Date
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumCost: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  saveCount: {
    type: Number,
    default: 0
  },
  shareCount: {
    type: Number,
    default: 0
  },
  reportCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for common queries
FeedItemSchema.index({ isActive: 1, createdAt: -1 });
FeedItemSchema.index({ tags: 1 });
FeedItemSchema.index({ source: 1, sourceId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('FeedItem', FeedItemSchema);