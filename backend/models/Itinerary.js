const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  time: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ['flight', 'activity', 'lodging', 'dining', 'attractions', 'other'] },
  cost: { type: Number, default: 0 },
  location: { type: String }
});

const itinerarySchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Trip',
  },
  dayNumber: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  activities: [activitySchema],
}, {
  timestamps: true
});

module.exports = mongoose.model('Itinerary', itinerarySchema);
