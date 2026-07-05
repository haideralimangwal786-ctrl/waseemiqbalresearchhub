const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  type: { type: String, default: "Full-Time" },
  description: { type: String, required: true },
  highlights: [{ type: String }],
  color: { type: String, default: "text-blue-500" },
  link: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
