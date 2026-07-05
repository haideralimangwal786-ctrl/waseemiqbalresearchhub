const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  bio: { type: String, required: true },
  institution: { type: String, required: true },
  location: { type: String, required: true },
  stats: [{
    label: { type: String, required: true },
    value: { type: String, required: true },
    icon: { type: String, default: "BookOpen" }
  }],
  socialLinks: [{
    platform: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, default: "FaLink" }
  }],
  researchAreas: [{ type: String }],
  cvUrl: { type: String, default: "/Waseem CV-N.pdf" },
  images: {
    profilePicture: { type: String, default: "/profile.jpeg" },
    coverBanner: { type: String, default: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=2000&q=80" }
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
