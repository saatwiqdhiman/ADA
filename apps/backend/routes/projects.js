const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Get all projects of the user sorted by lastOpened in descending order
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id }).sort({ lastOpened: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new project
router.post('/', [auth, [
  check('name', 'Project name is required').not().isEmpty(),
  check('description', 'Project description is required').not().isEmpty()
]], async (req, res) => {
  console.log('Project creation route hit');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors);
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description } = req.body;
  console.log('Request body:', req.body);

  try {
    let project = new Project({
      name,
      description,
      owner: req.user.id  // Make sure req.user is valid
    });

    project = await project.save();
    console.log('Project created:', project);
    res.json(project);
  } catch (err) {
    console.error('Error saving project:', err.message);
    res.status(500).send('Server Error');
  }
});


// Update the lastOpened field when a project is accessed
router.put('/:id/open', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Make sure the user owns the project
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    project.lastOpened = Date.now();
    await project.save();

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!project) {
      return res.status(404).json({ msg: 'Project not found or you do not have access' });
    }

    res.json(project);  // Send the found project back as a JSON response
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');  // Generic server error if something fails
  }
});

module.exports = router;
