const jwt = require("jsonwebtoken");
const { signToken } = require('../utils/jwt');
const User = require("../models/User.js");

const generateToken = (payload) => {
  return signToken(payload);
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role });
    const token = generateToken({ id: user._id, email: user.email, role: user.role, name: user.name });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = generateToken({ id: user._id, email: user.email, role: user.role, name: user.name });
      return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, loginUser };