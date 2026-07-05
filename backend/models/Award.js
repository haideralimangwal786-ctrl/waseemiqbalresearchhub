const mongoose = require('mongoose');

const awardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  year: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, default: "Award" }, // e.g., "Scholarship", "Grant"
  color: { type: String, default: "blue" },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Award', awardSchema);
