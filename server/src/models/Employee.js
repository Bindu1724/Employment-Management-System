const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    roleTitle: { type: String, required: true },
    joinDate: { type: Date, default: Date.now },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['active', 'on_leave', 'terminated'], default: 'active' },
    salary: { type: Number, min: 0 }
  },
  { timestamps: true }
);

employeeSchema.index({ firstName: "text", lastName: "text", email: "text", roleTitle: "text", department: "text" });

module.exports = mongoose.model('Employee', employeeSchema);