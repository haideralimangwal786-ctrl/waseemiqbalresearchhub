const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Helper to get the correct model based on URL param
const getModel = (type) => {
  const models = {
    profile: require('../models/Profile'),
    about: require('../models/About'),
    experience: require('../models/Experience'),
    publications: require('../models/Publication'),
    research_areas: require('../models/ResearchArea'),
    ongoing_projects: require('../models/OngoingProject'),
    skills: require('../models/SkillCategory'),
    awards: require('../models/Award'),
    training: require('../models/Training'),
    education: require('../models/Education'),
    contact_info: require('../models/ContactInfo'),
    references: require('../models/Reference'),
    events: require('../models/Event')
  };
  return models[type] || null;
};

// GET all items for a specific section
router.get('/:type', async (req, res) => {
  try {
    const Model = getModel(req.params.type);
    if (!Model) return res.status(404).json({ message: 'Invalid section type' });

    const items = await Model.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single item
router.get('/:type/:id', async (req, res) => {
  try {
    const Model = getModel(req.params.type);
    if (!Model) return res.status(404).json({ message: 'Invalid section type' });

    const item = await Model.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new item (Protected)
router.post('/:type', auth, async (req, res) => {
  try {
    const Model = getModel(req.params.type);
    if (!Model) return res.status(404).json({ message: 'Invalid section type' });

    const newItem = new Model(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update item (Protected)
router.put('/:type/:id', auth, async (req, res) => {
  try {
    const Model = getModel(req.params.type);
    if (!Model) return res.status(404).json({ message: 'Invalid section type' });

    const updatedItem = await Model.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE item (Protected)
router.delete('/:type/:id', auth, async (req, res) => {
  try {
    const Model = getModel(req.params.type);
    if (!Model) return res.status(404).json({ message: 'Invalid section type' });

    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
