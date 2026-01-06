const Joi = require('joi');

const registerValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
    role: Joi.string().valid('admin', 'manager', 'employee')
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400)
      .json({ message: error.message });
  }
  next();
};

const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required()
  });
  const { error} = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

module.exports = { registerValidation, loginValidation };