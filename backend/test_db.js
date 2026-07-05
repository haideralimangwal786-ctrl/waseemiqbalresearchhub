const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Profile = require('./models/Profile');

dotenv.config();

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const profile = await Profile.findOne();
    console.log('Current Profile in DB:', JSON.stringify(profile, null, 2));

    if (profile) {
      // Try to save it as-is to see if validation works
      console.log('Attempting dry-run save...');
      await profile.save();
      console.log('Save dry-run succeeded!');
    }
    process.exit();
  } catch (error) {
    console.error('Validation or Connection Error:', error);
    process.exit(1);
  }
};

test();
