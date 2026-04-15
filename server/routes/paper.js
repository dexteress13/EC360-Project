const express = require('express');
const router = express.Router();
const Paper = require('../models/Paper');
const upload = require('../middleware/upload');
const authenticateToken = require('../middleware/auth');

// SUBMIT PAPER
router.post('/submit', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    console.log('Paper submit attempt:', req.body.title, 'File:', req.file ? req.file.originalname : 'NO FILE');
    console.log('User:', req.user ? req.user.id : 'NO USER');
    const { title, abstract, keywords } = req.body;

    // Validate fields
    if (!title || !abstract || !keywords) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate file uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'PDF file is required' });
    }

    // Convert keywords string to array
    const keywordsArray = keywords
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k !== '');

    // Save paper - use authenticated user ID
    const paper = new Paper({
      title,
      abstract,
      keywords: keywordsArray,
      filePath: req.file.path,
      fileName: req.file.originalname,
      submittedBy: req.user.id,
      status: 'submitted'
    });

    await paper.save();

    res.status(201).json({ message: 'Paper submitted successfully', paper });

    } catch (error) {
    console.error('Paper submit error:', error);
    if (error.message === 'Only PDF files are allowed') {
      return res.status(400).json({ message: 'Only PDF files are allowed' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET ALL PAPERS
router.get('/all', async (req, res) => {
  try {
    const papers = await Paper.find();
    res.status(200).json(papers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET AUTHOR'S PAPERS
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const papers = await Paper.find({ submittedBy: req.user.id })
      .select('_id title abstract keywords submissionDate status fileName keywords')
      .sort({ submissionDate: -1 });
    res.json({
      success: true,
      papers,
      count: papers.length
    });
  } catch (error) {
    console.error('Error fetching author papers:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch papers'
    });
  }
});

// ADMIN DECISION ENDPOINT
router.put('/:id/decision', authenticateToken, async (req, res) => {
  try {
if (req.user.role !== 'editor') {
  return res.status(403).json({ message: 'Editor access only' });
}

    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or rejected' });
    }

    const paper = await Paper.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('submittedBy', 'name email');

    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }

    res.json({
      success: true,
      message: `Paper ${status} successfully`,
      paper
    });
  } catch (error) {
    console.error('Decision error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
