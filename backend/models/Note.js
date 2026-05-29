const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  title: { type: String },
  content: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
