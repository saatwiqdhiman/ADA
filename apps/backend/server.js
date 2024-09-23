const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Body parser
console.log('Middleware set up: CORS and JSON body parser initialized.');

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Routes Initialization
let authRoutes, projectRoutes, uploadRoutes, dataSourcesRoutes;

try {
  authRoutes = require('./routes/auth');
  console.log('Auth routes loaded successfully.');
} catch (err) {
  console.error('Error loading auth routes:', err);
}

try {
  projectRoutes = require('./routes/projects');
  console.log('Project routes loaded successfully.');
} catch (err) {
  console.error('Error loading project routes:', err);
}

try {
  uploadRoutes = require('./routes/upload');
  console.log('Upload routes loaded successfully.');
} catch (err) {
  console.error('Error loading upload routes:', err);
}

try {
  dataSourcesRoutes = require('./routes/dataSources');
  console.log('Data Sources routes loaded successfully.');
} catch (err) {
  console.error('Error loading data sources routes:', err);
}

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

// Routes
app.get('/', (req, res) => {
  console.log('GET request to /');
  res.send('AIDA API is running');
});

// Use the auth routes for handling authentication-related endpoints
if (authRoutes) {
  app.use('/auth', authRoutes);
  console.log('Auth routes initialized at /auth');
} else {
  console.error('Auth routes were not initialized due to loading error.');
}

// Register the project routes with /api/projects prefix
if (projectRoutes) {
  app.use('/api/projects', projectRoutes);
  console.log('Project routes initialized at /api/projects');
} else {
  console.error('Project routes were not initialized due to loading error.');
}

// Register the upload routes with /api/upload prefix
if (uploadRoutes) {
  app.use('/api/upload', uploadRoutes);
  console.log('Upload routes initialized at /api/upload');
} else {
  console.error('Upload routes were not initialized due to loading error.');
}

// Register the data sources routes
if (dataSourcesRoutes) {
  app.use('/api/data-sources', dataSourcesRoutes);
  console.log('Data Sources routes initialized at /api/data-sources');
} else {
  console.error('Data Sources routes were not initialized due to loading error.');
}

// Global error handling middleware (optional but good for production)
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err.stack);
  res.status(500).send('Internal Server Error');
});

// Start server
app.listen(port, () => {
  connectDB();
  console.log(`Server running on port ${port}`);
});
