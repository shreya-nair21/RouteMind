const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  destination: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  spent: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Planning', 'Upcoming', 'Completed'],
    default: 'Planning',
  },
  coverImage: {
    type: String,
  },
  stops: [{
    city: { type: String, required: true },
    duration: { type: Number, required: true }, // days
  }],
  isPublic: {
    type: Boolean,
    default: false,
  },
  transportMode: {
    type: String,
    enum: ['flight', 'train', 'bus', 'car'],
    default: 'flight'
  },
  travelerCount: {
    type: Number,
    default: 1
  },
  budgetBreakdown: {
    accommodation: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    activities: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Trip', tripSchema);
