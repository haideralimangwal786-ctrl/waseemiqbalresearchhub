const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  journal: { type: String, required: true },
  authors: { type: String, required: true },
  category: { type: String, required: true },
  doi: { type: String }, // optional, for 'In Prep' it's empty
  paperUrl: { type: String }, // optional, direct link to PDF
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Publication', publicationSchema);
