const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error('JWT_SECRET is not set. Add JWT_SECRET to your .env');
}
const EXPIRES = process.env.JWT_EXPIRES || '1d';

const signToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: EXPIRES });
const verifyToken = (token) => jwt.verify(token, SECRET);

module.exports = { signToken, verifyToken };