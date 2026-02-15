const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  role: { type: String, required: true, enum: ['admin', 'cashier'] },
  phone: { type: String, maxlength: 20, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
