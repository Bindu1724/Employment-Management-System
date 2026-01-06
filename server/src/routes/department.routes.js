const router = require('express').Router();
const Department = require('../models/Department');
const { auth, permit } = require('../middleware/auth');

router.get('/', auth, async (_, res) => {
  const data = await Department.find().sort('name');
  res.json(data);
});

router.post('/', auth, permit('admin'), async (req, res) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json(dept);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put('/:id', auth, permit('admin'), async (req, res) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(dept);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id', auth, permit('admin'), async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;