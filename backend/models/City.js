const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  costIndex: { type: Number, required: true },
  popularity: { type: Number, required: true },
  coverImage: { type: String },
  region: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('City', citySchema);
