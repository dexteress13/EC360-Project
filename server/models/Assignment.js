const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  paperId: { type: mongoose.Schema.Types.ObjectId, ref: 'Paper', required: true },
  paperTitle: String,
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewerName: String,
  reviewerEmail: String,
  assignedDate: { type: Date, default: Date.now },
  deadline: Date,
  status: { type: String, enum: ['pending', 'assigned', 'in_progress', 'completed'], default: 'pending' },
  matchedKeywords: [String],
  matchScore: Number,
  review: String,
  rating: Number,
  decision: { type: String, enum: ['accept', 'reject'], default: null },
  submittedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Assignment', assignmentSchema);