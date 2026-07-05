const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  description1: { type: String, required: true },
  description2: { type: String, required: true },
  emailPrimary: { type: String, required: true },
  emailPrimaryLabel: { type: String, default: 'Institutional' },
  emailSecondary: { type: String },
  emailSecondaryLabel: { type: String, default: 'Personal' },
  phonePrimary: { type: String, required: true },
  phonePrimaryLabel: { type: String, default: 'Italy' },
  phoneSecondary: { type: String },
  phoneSecondaryLabel: { type: String, default: 'France' },
  affiliation: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
