const mongoose = require('mongoose');

const skillCategorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  icon: { type: String, required: true }, // Name of the Lucide icon, e.g., 'FlaskConical'
  color: { type: String, default: "text-blue-500" },
  skills: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('SkillCategory', skillCategorySchema);
