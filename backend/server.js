const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const analyzeRoutes = require('./routes/analyze');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON bodies

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', analyzeRoutes);

// Simple root endpoint for health check
app.get('/', (req, res) => {
  res.send('AI Resume Analyzer API is running...');
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});

