// routes/dataSources.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const DataSource = require('../models/DataSource');
const { check, validationResult } = require('express-validator');

/**
 * @route   GET /api/data-sources
 * @desc    Get all data sources for the authenticated user and project
 * @access  Private
 */
router.get('/', [auth, [check('projectId', 'Project ID is required').not().isEmpty()]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { projectId } = req.query;

  try {
    const dataSources = await DataSource.find({ owner: req.user.id, project: projectId });
    res.json(dataSources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
