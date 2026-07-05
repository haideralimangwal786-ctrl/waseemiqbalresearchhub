const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth'); // Secure upload route so only admins can upload

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    let prefix = 'doc-';
    if (file.mimetype.startsWith('image/')) prefix = 'img-';
    if (file.mimetype.startsWith('video/')) prefix = 'vid-';
    cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept images and document files
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'
  ];
  if (allowedTypes.includes(file.mimetype) || file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images, PDFs, and Word documents are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// POST /api/upload
router.post('/', auth, upload.any(), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const file = req.files[0];
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    
    res.json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
