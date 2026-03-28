require('dotenv').config();
const express = require('express');
const cors = require('cors');

const uploadRoutes = require('./routes/upload');
const interviewRoutes = require('./routes/interview');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Vite default port
app.use(express.json());

// Routes
app.use('/api', uploadRoutes);
app.use('/api', interviewRoutes);

// Test Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Platform is online and AI is ready' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
