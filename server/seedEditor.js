const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');

    // Check if editor already exists
    const existing = await User.findOne({ role: 'editor' });
    if (existing) {
      console.log('Editor already exists:', existing.email);
      process.exit();
    }

    // Create editor
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('editor123', salt);

    const editor = new User({
      name: 'Editor',
      email: 'editor@revmatch.com',
      password: hashedPassword,
      role: 'editor'
    });

    await editor.save();
    console.log('Editor created successfully');
    console.log('Email: editor@revmatch.com');
    console.log('Password: editor123');
    process.exit();
  })
  .catch((err) => {
    console.log('Error:', err);
    process.exit();
  });