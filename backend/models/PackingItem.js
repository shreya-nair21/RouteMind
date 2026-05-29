const mongoose = require('mongoose');

const packingItemSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  name: { type: String, required: true },
  category: { type: String, default: 'General' },
  packed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('PackingItem', packingItemSchema);
