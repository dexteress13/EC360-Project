const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  abstract: { type: String, required: true },
  keywords: [String],
  authors: [String],
  filePath: String,
  fileName: String,
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
content: String,
  status: { type: String, enum: ['submitted', 'under_review', 'reviewed', 'accepted', 'rejected'], default: 'submitted' },


});

module.exports = mongoose.model('Paper', paperSchema);