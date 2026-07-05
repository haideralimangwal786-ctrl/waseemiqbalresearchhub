const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth'); // Secure upload route so only admins can upload

// Storage configuration - Use memory storage to return Base64 string directly
// This bypasses Render's ephemeral disk limitation where uploaded files are deleted on restart
const storage = multer.memoryStorage();

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
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit to keep MongoDB document size safe
});

// POST /api/upload
router.post('/', auth, upload.any(), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const file = req.files[0];
    
    // Convert buffer to base64 string
    const base64String = file.buffer.toString('base64');
    
    // Create Data URL
    const fileUrl = `data:${file.mimetype};base64,${base64String}`;
    
    res.json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
