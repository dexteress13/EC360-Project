const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const authMiddleware = require('./middleware/auth');
const reviewerRoutes = require('./routes/reviewer');
app.use('/api/reviewer', reviewerRoutes);
const paperRoutes = require('./routes/paper');
app.use('/api/paper', paperRoutes);
const assignmentRoutes = require('./routes/assignment');
app.use('/api/assignment', assignmentRoutes);

const editorRoutes = require('./routes/editor');
app.use('/api/editor', editorRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    
    // Seed default admin if none exists
    const User = require('./models/User');
    const editorCount = await User.countDocuments({ role: 'editor', isPrimary: true });
    if (editorCount === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const editorUser = new User({
        name: 'System Administrator',
        email: 'editor@revmatch.com',
        password: hashedPassword,
        role: 'editor',
        isPrimary: true
      });
      await editorUser.save();
      console.log('Default editor created: editor@revmatch.com / admin123');
    } else {
      console.log('Admin already exists');
    }
    
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log('DB connection error:', err));
