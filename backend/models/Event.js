const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Music', 'Sports', 'Arts', 'Business', 'Education', 'Other']
  },
  venue: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  ticketPrice: {
    type: Number,
    required: true,
    min: 0
  },
  // Optional image URL for event poster/thumbnail
  imageUrl: {
    type: String,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
eventSchema.index({ category: 1, isActive: 1 });
eventSchema.index({ date: 1 });

module.exports = mongoose.model('Event', eventSchema);
