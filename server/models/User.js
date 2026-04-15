const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['author', 'reviewer', 'editor'],
    default: 'author'
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
expertise: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);