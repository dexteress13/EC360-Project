const express = require('express');
const router = express.Router();
const Reviewer = require('../models/Reviewer');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// UPDATE REVIEWER EXPERTISE (self)
router.put('/expertise', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    if (user.role !== 'reviewer') {
      return res.status(403).json({ message: 'Only reviewers can update expertise' });
    }

    const { expertise } = req.body;
    if (!expertise || !Array.isArray(expertise) || expertise.length === 0) {
      return res.status(400).json({ message: 'Expertise array required' });
    }

    // Update user expertise
    user.expertise = expertise;
    await user.save();

    res.status(200).json({ message: 'Expertise updated successfully', expertise: user.expertise });

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