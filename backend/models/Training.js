const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  institution: { type: String, required: true },
  location: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  highlights: [{ type: String }],
  flag: { type: String },
  color: { type: String, default: "text-amber-500" }
}, { timestamps: true });

module.exports = mongoose.model('Training', trainingSchema);
