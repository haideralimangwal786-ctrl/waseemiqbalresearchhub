const mongoose = require('mongoose');

const researchAreaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: { type: String, required: true, default: "Atom" },
  description: { type: String, required: true },
  colorTheme: { type: String, required: true, default: "blue" }, // e.g., "blue", "amber", "indigo", "orange", "teal"
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('ResearchArea', researchAreaSchema);
