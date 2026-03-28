const express = require('express');
const router = express.Router();
const Paper = require('../models/Paper');
const upload = require('../middleware/upload');

// SUBMIT PAPER
router.post('/submit', upload.single('file'), async (req, res) => {
  try {
    const { title, abstract, keywords, submittedBy } = req.body;

    // Validate fields
    if (!title || !abstract || !keywords || !submittedBy) {
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

    // Save paper
    const paper = new Paper({
      title,
      abstract,
      keywords: keywordsArray,
      filePath: req.file.path,
      fileName: req.file.originalname,
      submittedBy
    });

    await paper.save();

    res.status(201).json({ message: 'Paper submitted successfully', paper });

  } catch (error) {
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

module.exports = router;