const mongoose = require('mongoose');

const ongoingProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, required: true, default: "Manuscript in Preparation" },
  category: { type: String, required: true },
  collaborators: [{ type: String }],
  description: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('OngoingProject', ongoingProjectSchema);
