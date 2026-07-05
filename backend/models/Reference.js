const mongoose = require('mongoose');

const referenceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  institution: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Reference', referenceSchema);
