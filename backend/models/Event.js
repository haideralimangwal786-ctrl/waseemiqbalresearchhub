const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  mediaUrl: {
    type: String, // URL of the uploaded image or video
    default: ''
  },
  mediaType: {
    type: String,
    enum: ['image', 'video', 'none'],
    default: 'none'
  },
  link: {
    type: String, // Optional external link for more info
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
