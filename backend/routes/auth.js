const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        username: user.username
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '10h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, username: user.username });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create initial admin user (Development Only Route)
router.post('/setup', async (req, res) => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const user = new User({
      username: 'admin',
      password: hashedPassword
    });

    await user.save();
    res.json({ message: 'Admin created successfully. Username: admin, Password: admin123' });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// PUT /api/auth/credentials - Change Username/Password
router.put('/credentials', authMiddleware, async (req, res) => {
  const { currentPassword, newUsername, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    // Update username if provided
    if (newUsername && newUsername.trim() !== '') {
      // Check if new username is already taken by another user (if there were multiple users)
      const existingUser = await User.findOne({ username: newUsername });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      user.username = newUsername;
    }

    // Update password if provided
    if (newPassword && newPassword.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    res.json({ message: 'Credentials updated successfully' });

  } catch (error) {
    console.error('Error updating credentials:', error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
