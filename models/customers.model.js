const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 100 },
    phone: { type: String, required: true, unique: true, maxlength: 20 },
    address: { type: String },
    created_at: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
