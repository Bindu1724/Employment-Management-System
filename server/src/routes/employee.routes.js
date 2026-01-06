const router = require('express').Router();
const Employee = require('../models/Employee');
const { employeeSchema } = require('../validation/employee.validation');
const { auth, permit } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const { q, status, department, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (department) filter.department = department;
  if (q) filter.$or = [
    { firstName: new RegExp(q, 'i') },
    { lastName: new RegExp(q, 'i') },
    { email: new RegExp(q, 'i') }
  ];
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Employee.find(filter).populate('department').skip(skip).limit(Number(limit)).sort('-createdAt'),
    Employee.countDocuments(filter)
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

router.post('/', auth, permit('admin', 'manager'), async (req, res) => {
  const { error, value } = employeeSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  try {
    const emp = await Employee.create(value);
    res.status(201).json(emp);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  const emp = await Employee.findById(req.params.id).populate('department manager');
  if (!emp) return res.status(404).json({ message: 'Not found' });
  res.json(emp);
});

router.put('/:id', auth, permit('admin', 'manager'), async (req, res) => {
  try {
    const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(emp);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id', auth, permit('admin'), async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;