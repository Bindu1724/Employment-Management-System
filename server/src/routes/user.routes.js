const router = require('express').Router();
const User = require('../models/User');
const { auth, permit } = require('../middleware/auth');

router.get('/', auth, permit('admin'), async (_, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

router.put('/:id/role', auth, permit('admin'), async (req, res) => {
  const { role } = req.body;
  if (!['admin', 'manager', 'employee'].includes(role))
    return res.status(400).json({ message: 'Invalid role' });
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
  res.json(user);
});

router.patch('/:id/toggle', auth, permit('admin'), async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  user.isActive = !user.isActive;
  await user.save();
  res.json({ id: user._id, isActive: user.isActive });
});

module.exports = router;