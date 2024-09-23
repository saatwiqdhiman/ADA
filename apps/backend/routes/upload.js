

/// routes/upload.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { check, validationResult } = require('express-validator');
const DataSource = require('../models/DataSource');
const DataEntry = require('../models/DataEntry');
const Project = require('../models/Project');
const csvParser = require('csv-parser');
const fs = require('fs');

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// File filter to validate file type
const fileFilter = (req, file, cb) => {
  const { fileType } = req.body;
  const allowedTypes = {
    csv: ['text/csv', 'application/vnd.ms-excel', 'application/csv'],
    sql: ['application/sql', 'text/plain'],
  };

  if (allowedTypes[fileType] && allowedTypes[fileType].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only ${fileType.toUpperCase()} files are allowed.`));
  }
};

// Initialize Multer with storage and file filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter,
});

/**
 * @route   POST /api/upload
 * @desc    Upload and process a file (CSV or SQL)
 * @access  Private
 */
router.post(
  '/',
  [
    auth,
    upload.single('file'),
    [
      check('fileType', 'File type is required and must be either csv or sql').isIn(['csv', 'sql']),
      check('projectId', 'Project ID is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    console.log('File upload route hit');
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Delete the uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ errors: errors.array() });
    }

    const { fileType, projectId } = req.body;
    const file = req.file;

    try {
      // Check if the project exists and belongs to the user
      const project = await Project.findOne({ _id: projectId, owner: req.user.id });
      if (!project) {
        // Delete the uploaded file if the project is invalid
        if (file && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        return res.status(404).json({ msg: 'Project not found' });
      }

      // Create a new DataSource entry
      const dataSource = new DataSource({
        name: file.originalname,
        type: 'Manual Upload',
        fileType: fileType,
        filePath: file.path,
        owner: req.user.id,
        project: projectId,
      });

      await dataSource.save();

      // Process the file
      if (fileType === 'csv') {
        await processCSVFile(file.path, dataSource._id);
      } else if (fileType === 'sql') {
        await processSQLFile(file.path, dataSource._id);
      }

      res.json({ msg: 'File uploaded and processed successfully', dataSourceId: dataSource._id });
    } catch (err) {
      console.error(err.message);
      // Delete the uploaded file in case of error
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      res.status(500).send('Server Error');
    }
  }
);

// Function to process CSV files
async function processCSVFile(filePath, dataSourceId) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        try {
          // Save data entries to the database
          if (results.length > 0) {
            await DataEntry.insertMany(
              results.map((entry) => ({
                dataSource: dataSourceId,
                data: entry,
              }))
            );
          }
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

// Function to process SQL files
async function processSQLFile(filePath, dataSourceId) {
  return new Promise((resolve, reject) => {
    // Read SQL file content
    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        return reject(err);
      }

      // Parse SQL queries (simplified example)
      const sqlStatements = data
        .split(';')
        .map((stmt) => stmt.trim())
        .filter(Boolean);

      try {
        if (sqlStatements.length > 0) {
          await DataEntry.insertMany(
            sqlStatements.map((stmt) => ({
              dataSource: dataSourceId,
              data: { query: stmt },
            }))
          );
        }
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
}

module.exports = router;
