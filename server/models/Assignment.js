const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  paperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paper',
    required: true
  },
  paperTitle: {
    type: String,
    required: true
  },
  paperFilePath: {
    type: String,
    required: true
  },
  paperFileName: {
    type: String,
    required: true
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reviewer',
    required: true
  },
  reviewerName: {
    type: String,
    required: true
  },
  reviewerEmail: {
    type: String,
    required: true
  },
  matchedKeywords: {
    type: [String],
    required: true
  },
  matchScore: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);