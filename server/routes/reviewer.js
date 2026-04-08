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
    
    // Fetch all assignments for this reviewer
    const assignments = await Assignment.find({ 
      reviewerId: reviewerId,
      status: { $ne: 'completed' } // Optional: exclude completed reviews
    }).lean();
    
    const paperIds = assignments.map(a => a.paperId);
    
    // Fetch papers with title and abstract
    const papers = await Paper.find({ 
      _id: { $in: paperIds } 
    }).select('_id title abstract authors submissionDate filePath').lean();
    
    // Combine with assignment info
    const reviewerPapers = papers.map(paper => {
      const assignment = assignments.find(a => a.paperId.toString() === paper._id.toString());
      return {
        ...paper,
        assignedDate: assignment.assignedDate,
        deadline: assignment.deadline,
        status: assignment.status
      };
    });
    
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

module.exports = router;
