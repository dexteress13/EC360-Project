const express = require('express');
const router = express.Router();
const Paper = require('../models/Paper');
const User = require('../models/User');
const Assignment = require('../models/Assignment');

// MATCHING ALGORITHM
function findBestMatch(paperKeywords, reviewers) {
  let bestMatch = null;
  let highestScore = 0;
  let bestMatchedKeywords = [];

  reviewers.forEach((reviewer) => {
    const matchedKeywords = [];

    paperKeywords.forEach((keyword) => {
      const found = reviewer.expertise.some(
        (exp) => exp.toLowerCase() === keyword.toLowerCase()
      );
      if (found) matchedKeywords.push(keyword);
    });

    const score = matchedKeywords.length;

    if (score > highestScore) {
      highestScore = score;
      bestMatch = reviewer;
      bestMatchedKeywords = matchedKeywords;
    }
  });

  return { bestMatch, highestScore, bestMatchedKeywords };
}

// GET POTENTIAL MATCHES FOR A PAPER
router.get('/potential-matches/:paperId', async (req, res) => {
  try {
    const { paperId } = req.params;
    const paper = await Paper.findById(paperId);
    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }

    const reviewers = await User.find({ role: 'reviewer' });
    
    const matches = reviewers.map(reviewer => {
      const matchedKeywords = [];
      paper.keywords.forEach((keyword) => {
        const found = reviewer.expertise.some(
          (exp) => exp.toLowerCase() === keyword.toLowerCase()
        );
        if (found) matchedKeywords.push(keyword);
      });

      return {
        _id: reviewer._id,
        name: reviewer.name,
        email: reviewer.email,
        expertise: reviewer.expertise,
        matchedKeywords,
        score: matchedKeywords.length
      };
    }).sort((a, b) => b.score - a.score);

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ASSIGN REVIEWER TO PAPER
router.post('/assign/:paperId', async (req, res) => {
  try {
    const { paperId } = req.params;

    // Get paper
    const paper = await Paper.findById(paperId);
    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }
    console.log(`Paper status before auto-assign: ${paper.status}`);

    // Get all reviewer users
    const reviewers = await User.find({ role: 'reviewer' });
    if (reviewers.length === 0) {
      return res.status(404).json({ message: 'No reviewers found in database' });
    }

    // Run matching algorithm
    const { bestMatch, highestScore, bestMatchedKeywords } = findBestMatch(
      paper.keywords,
      reviewers
    );

    if (!bestMatch || highestScore === 0) {
      return res.status(404).json({ message: 'No matching reviewer found for this paper' });
    }

    // Check if already assigned
    const existing = await Assignment.findOne({ paperId });
    if (existing) {
      return res.status(400).json({ message: 'Reviewer already assigned to this paper' });
    }

    // Save assignment
    const assignment = new Assignment({
      paperId: paper._id,
      paperTitle: paper.title,
      reviewerId: bestMatch._id,
      reviewerName: bestMatch.name,
      reviewerEmail: bestMatch.email,
      matchedKeywords: bestMatchedKeywords,
      matchScore: highestScore,
      status: 'assigned'
    });

    await assignment.save();

    // Update paper status
    paper.status = 'under_review';
    await paper.save();
    console.log(`Paper status after auto-assign: ${paper.status}`);

    res.status(201).json({
      message: 'Reviewer assigned successfully',
      assignment
    });

  } catch (error) {
    console.error("Error during auto-assignment:", error); // Log the full error for debugging
    res.status(500).json({ message: 'Server error', error: error.message }); 
  }
});

// MANUALLY ASSIGN A SPECIFIC REVIEWER
router.post('/assign-manual', async (req, res) => {
  try {
    const { paperId, reviewerId } = req.body;

    const paper = await Paper.findById(paperId);
    const reviewer = await User.findById(reviewerId);

    if (!paper || !reviewer) {
      return res.status(404).json({ message: 'Paper or Reviewer not found' });
    }
    console.log(`Paper status before manual assign: ${paper.status}`);

    const existing = await Assignment.findOne({ paperId });
    if (existing) {
      return res.status(400).json({ message: 'Reviewer already assigned to this paper' });
    }

    const matchedKeywords = [];
    paper.keywords.forEach((keyword) => {
      const found = reviewer.expertise.some(
        (exp) => exp.toLowerCase() === keyword.toLowerCase()
      );
      if (found) matchedKeywords.push(keyword);
    });

    const assignment = new Assignment({
      paperId: paper._id,
      paperTitle: paper.title,
      reviewerId: reviewer._id,
      reviewerName: reviewer.name,
      reviewerEmail: reviewer.email,
      matchedKeywords: matchedKeywords,
      matchScore: matchedKeywords.length,
      status: 'assigned'
    });

    await assignment.save();
    
    // Update paper status
    paper.status = 'under_review';
    console.log(`Paper status after manual assign: ${paper.status}`);
    await paper.save();

    res.status(201).json({
      message: 'Reviewer assigned successfully',
      assignment
    });
  } catch (error) {
    console.error("Error during manual assignment:", error); // Log the full error for debugging
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET ALL ASSIGNMENTS
router.get('/all', async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET ALL PAPERS (for dropdown)
router.get('/papers', async (req, res) => {
  try {
    const papers = await Paper.find();
    res.status(200).json(papers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
