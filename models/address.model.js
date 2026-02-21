// models/Address.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  region: {
    type: String,
    required: true,
    trim: true,
  },
  neighborhood: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

// 👇 جلوگیری از ثبت تکراری منطقه + محله
addressSchema.index(
  { region: 1, neighborhood: 1 },
  { unique: true }
);

module.exports = mongoose.model('Address', addressSchema);