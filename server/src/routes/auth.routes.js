const router = require('express').Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Use controller handlers directly and return consistent responses expected by client
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;