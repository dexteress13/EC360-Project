const express = require('express');
const router = express.Router();
const Reviewer = require('../models/Reviewer');

// CREATE REVIEWER PROFILE
router.post('/create', async (req, res) => {
  try {
    const { name, email, expertise } = req.body;

    // Validate fields
    if (!name || !email || !expertise || expertise.length === 0) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if reviewer already exists
    const existing = await Reviewer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Reviewer with this email already exists' });
    }

    // Save reviewer
    const reviewer = new Reviewer({ name, email, expertise });
    await reviewer.save();

    res.status(201).json({ message: 'Reviewer profile created successfully', reviewer });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET ALL REVIEWERS
router.get('/all', async (req, res) => {
  try {
    const reviewers = await Reviewer.find();
    res.status(200).json(reviewers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;