const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const adminRoutes = require('./routes/adminRoutes');

const path = require('path');
const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

// Set security headers
app.use(helmet());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Rate limiting (100 requests per 10 minutes)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
});
app.use('/api', limiter);

app.use(cors());
app.use(express.json());

// Static folder for file uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/uap')
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/admin', adminRoutes);

// Error Handler (MUST be after routes)
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
