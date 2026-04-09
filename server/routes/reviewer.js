// routes/reviewerRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const Paper = require('../models/Paper');
const Assignment = require('../models/Assignment');
const User = require('../models/User');

// PUT /api/reviewer/expertise - Update reviewer expertise
router.put('/expertise', authenticateToken, async (req, res) => {
  try {
    const reviewerId = req.user.id;
    const { expertise } = req.body;

    if (!Array.isArray(expertise) || expertise.length === 0) {
      return res.status(400).json({ message: 'Expertise must be non-empty array' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      reviewerId,
      { expertise },
      { new: true, runValidators: true }
    ).select('name email role expertise');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Reviewer not found' });
    }

    res.json({
      success: true,
      message: 'Expertise updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating expertise:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/reviewer/dashboard - Fetch papers assigned to reviewer
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const reviewerId = req.user.id;
    
    // Fetch assignments and populate paper details
    const assignments = await Assignment.find({ reviewerId: reviewerId })
      .populate('paperId', 'title abstract authors submissionDate filePath')
      .lean();
    
    // Transform to include assignmentId
    const reviewerPapers = assignments.map(assignment => ({
      _id: assignment.paperId._id,
      title: assignment.paperId.title,
      abstract: assignment.paperId.abstract,
      authors: assignment.paperId.authors,
      submissionDate: assignment.paperId.submissionDate,
      filePath: assignment.paperId.filePath,
      assignedDate: assignment.assignedDate,
      deadline: assignment.deadline,
      status: assignment.status,
      assignmentId: assignment._id // Essential for review submission
    }));
    
    res.json({
      success: true,
      papers: reviewerPapers,
      count: reviewerPapers.length
    });
  } catch (error) {
    console.error('Error fetching reviewer dashboard:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch assigned papers' 
    });
  }
});

// PUT /api/reviewer/submit-review/:assignmentId - Submit review + UPDATE PAPER STATUS
router.put('/submit-review/:assignmentId', authenticateToken, async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { review, decision } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment || assignment.reviewerId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    console.log('Found assignment:', assignment._id, 'reviewerId:', assignment.reviewerId, 'user.id:', req.user.id);

    if (assignment.status === 'completed') {
      return res.status(400).json({ message: 'Review already submitted' });
    }

    // Update assignment
    assignment.status = 'completed';
    assignment.review = review || '';
    assignment.decision = decision;
    assignment.submittedAt = new Date();
    await assignment.save();

// UPDATE PAPER STATUS to 'reviewed' (match Paper model enum) - skip if corrupt data
    const paper = await Paper.findById(assignment.paperId);
    if (paper) {
      try {
paper.status = 'reviewed';
        await paper.save();
      } catch (saveErr) {
        console.log('Paper save skipped - corrupt submittedBy:', paper.submittedBy);
      }
    }

    res.json({
      success: true,
      message: 'Review submitted & paper status updated to Reviewed!'
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

