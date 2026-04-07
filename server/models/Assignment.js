const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  paperId: { type: mongoose.Schema.Types.ObjectId, ref: 'Paper', required: true },
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedDate: { type: Date, default: Date.now },
  deadline: Date,
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
  review: String,
  rating: Number
});

module.exports = mongoose.model('Assignment', assignmentSchema);