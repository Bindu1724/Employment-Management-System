const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();
const PORT = process.env.PORT || 5000;


const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const deptRoutes = require('./routes/department.routes');
const empRoutes = require('./routes/employee.routes');

const app = express();
app.use(helmet());
app.use(cors({ origin: 'https://startling-cuchufli-78f449.netlify.app/', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/ping', ( req, res ) => {
  res.send('Pong');
})

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', deptRoutes);
app.use('/api/employees', empRoutes);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(process.env.PORT, () => console.log(`API running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};
start();