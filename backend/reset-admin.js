const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);
  
  // Find user 'admin' or just the first user
  const user = await User.findOne();
  if (user) {
    user.username = 'admin';
    user.password = hashedPassword;
    await user.save();
    console.log('Admin user reset successfully to admin / admin123');
  } else {
    const newUser = new User({
      username: 'admin',
      password: hashedPassword
    });
    await newUser.save();
    console.log('Admin user created successfully to admin / admin123');
  }
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
