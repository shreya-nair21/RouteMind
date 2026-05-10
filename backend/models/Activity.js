const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ['flight', 'activity', 'lodging', 'dining', 'attractions', 'other'] },
  cost: { type: Number, required: true },
  duration: { type: String }, // e.g. "2 hours" or "45 mins"
  description: { type: String },
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
