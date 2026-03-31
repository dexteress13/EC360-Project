const express = require('express');
const router = express.Router();
const Paper = require('../models/Paper');
const Reviewer = require('../models/Reviewer');
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

// ASSIGN REVIEWER TO PAPER
router.post('/assign/:paperId', async (req, res) => {
  try {
    const { paperId } = req.params;

    // Get paper
    const paper = await Paper.findById(paperId);
    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }

    // Get all reviewers
    const reviewers = await Reviewer.find();
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
      paperFilePath: paper.filePath,
      paperFileName: paper.fileName,
      reviewerId: bestMatch._id,
      reviewerName: bestMatch.name,
      reviewerEmail: bestMatch.email,
      matchedKeywords: bestMatchedKeywords,
      matchScore: highestScore
    });

    await assignment.save();

    res.status(201).json({
      message: 'Reviewer assigned successfully',
      assignment
    });

  } catch (error) {
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

// GET ASSIGNMENTS FOR REVIEWER
router.get('/reviewer/:reviewerEmail', async (req, res) => {
  try {
    const { reviewerEmail } = req.params;
    const assignments = await Assignment.find({ reviewerEmail: reviewerEmail.toLowerCase() }).sort({ createdAt: -1 });
    if (!assignments.length) {
      return res.status(404).json({ message: 'No assignments found for this reviewer' });
    }
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