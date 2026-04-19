const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const Paper = require('../models/Paper');
const Assignment = require('../models/Assignment');
const User = require('../models/User');

// Apply auth middleware to all routes
router.use(authenticateToken);

// GET /api/editor/papers - Get papers ready for final decision (reviewed) with reviews
router.get('/papers', async (req, res) => {
  try {
if (req.user.role !== 'editor') {
  return res.status(403).json({ message: 'Editor access only' });
}

// Find papers ready for editor decision (have reviews)
    const papers = await Paper.find({
      status: { $in: ['submitted', 'under_review', 'reviewed'] }
    }).populate('submittedBy', 'name email');

    // Fetch reviews/assignments for these papers
    const paperIds = papers.map(p => p._id);
    const assignments = await Assignment.find({ paperId: { $in: paperIds } });

    // Map assignments by paperId
    const assignmentsMap = {};
    assignments.forEach(assignment => {
      if (!assignmentsMap[assignment.paperId.toString()]) {
        assignmentsMap[assignment.paperId.toString()] = [];
      }
      assignmentsMap[assignment.paperId.toString()].push({
        reviewerId: assignment.reviewerId,
        reviewerName: assignment.reviewerName,
        review: assignment.review,
        rating: assignment.rating,
        submittedAt: assignment.submittedAt,
        status: assignment.status
      });
    });

    // Enrich papers with reviews
    const enrichedPapers = papers.map(paper => ({
      ...paper.toObject(),
      reviews: assignmentsMap[paper._id.toString()] || []
    }));

    res.json({
      success: true,
      papers: enrichedPapers,
      count: enrichedPapers.length
    });
  } catch (error) {
    console.error('Editor papers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/editor/paper/:id - Detailed paper for decision
router.get('/paper/:id', async (req, res) => {
  try {
if (req.user.role !== 'editor') {
  return res.status(403).json({ message: 'Editor access only' });
}

    const paper = await Paper.findById(req.params.id).populate('submittedBy', 'name email');
    const assignments = await Assignment.find({ paperId: req.params.id });

    const reviews = assignments.map(a => ({
      reviewerName: a.reviewerName,
      review: a.review,
      rating: a.rating,
      decision: a.decision,
      submittedAt: a.submittedAt
    }));

    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }

    res.json({
      success: true,
      paper: paper.toObject(),
      reviews
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/editor/users?role=author|reviewer|admin - Admin manages all users
router.get('/users', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
    }

    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Users list error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
