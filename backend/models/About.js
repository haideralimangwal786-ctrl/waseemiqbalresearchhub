const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  visionStatement: { type: String, required: true },
  aboutName: { type: String, required: true },
  aboutLocation: { type: String, required: true },
  aboutImage: { type: String, default: "/about-profile.jpeg" },
  researchFocus: [{ type: String, required: true }],
  coreCompetencies: [{ type: String }],
  academicJourney: [{
    icon: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('About', aboutSchema);
