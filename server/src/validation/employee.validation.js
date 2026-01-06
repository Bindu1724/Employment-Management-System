const Joi = require('joi');

const employeeSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow(''),
  department: Joi.string().hex().length(24).required(),
  roleTitle: Joi.string().required(),
  manager: Joi.string().hex().length(24).allow(null, ''),
  status: Joi.string().valid('active', 'on_leave', 'terminated'),
  salary: Joi.number().min(0)
});

module.exports = { employeeSchema };