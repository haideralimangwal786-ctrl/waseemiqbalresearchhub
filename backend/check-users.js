const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const users = await User.find();
  console.log('Users in DB:', users.map(u => ({ id: u._id, username: u.username, password: u.password })));
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
