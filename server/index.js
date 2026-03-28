const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const reviewerRoutes = require('./routes/reviewer');
app.use('/api/reviewer', reviewerRoutes);
const paperRoutes = require('./routes/paper');
app.use('/api/paper', paperRoutes);
const assignmentRoutes = require('./routes/assignment');
app.use('/api/assignment', assignmentRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log('DB connection error:', err));