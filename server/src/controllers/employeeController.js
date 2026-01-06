import Employee from "../models/Employee.js";

// Build filters: search + department + status
const buildQuery = ({ q, department, status }) => {
  const query = {};
  if (q) {
    query.$text = { $search: q };
  }
  if (department && department !== "All") {
    query.department = department;
  }
  if (status && status !== "All") {
    query.status = status;
  }
  return query;
};

export const getEmployees = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, q = "", department = "All", status = "All" } = req.query;
    const filters = buildQuery({ q, department, status });

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Employee.find(filters).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Employee.countDocuments(filters)
    ]);

    res.json({
      items,
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    next(err);
  }
};

export const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    next(err);
  }
};

export const createEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Email already exists" });
    next(err);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    next(err);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted" });
  } catch (err) {
    next(err);
  }
};