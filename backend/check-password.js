const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const user = await User.findOne();
  if (user) {
    const isMatch = await bcrypt.compare('admin123', user.password);
    console.log('Does password match admin123?', isMatch);
  }
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
