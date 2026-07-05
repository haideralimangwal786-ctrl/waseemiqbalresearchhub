const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const auth = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Cloudinary needs 'raw' for PDFs and docs
    let resource_type = 'auto';
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('application/')) {
      resource_type = 'raw';
    }

    return {
      folder: 'waseemiqbal_portfolio',
      resource_type: resource_type,
      public_id: Date.now() + '-' + Math.round(Math.random() * 1e9),
    };
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } 
});

router.post('/', auth, (req, res, next) => {
  // Check if Cloudinary is configured
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return res.status(500).json({ message: "Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment variables." });
  }
  next();
}, upload.any(), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Cloudinary returns the uploaded file URL in the 'path' property
    const fileUrl = req.files[0].path; 
    
    res.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
