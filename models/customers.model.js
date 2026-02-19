const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  phone: { type: String, required: true, unique: true, maxlength: 20 },
  address: { type: String },

  gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
  birthday: { type: Date, default: null },

}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
