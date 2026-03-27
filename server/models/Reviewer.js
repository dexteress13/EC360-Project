const mongoose = require('mongoose');

const reviewerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    expertise: [{ type: String }]
});

module.exports = mongoose.model('Reviewer', reviewerSchema);
