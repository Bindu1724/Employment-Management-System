const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// auth middleware — validates JWT and attaches user to req.user
const auth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if (!token) return res.status(401).json({ message: "No token provided" });
};

// permit middleware — returns a middleware that allows only the specified roles
const permit = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
  next();
};

module.exports = { auth, permit };