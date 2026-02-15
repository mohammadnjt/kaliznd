const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },  // UUID
    type: { type: String, required: true, enum: ['dine_in', 'takeaway', 'delivery'] },  // سالن، بیرون‌بر، پیک
    status: { type: String, default: 'beginning' },
    step: { type: String, default: 'selecting' },
    cart: {  // آرایه آیتم‌ها (JSON-like)
        type: [{
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 },
            ingredients: [{
                id: { type: String },
                name: { type: String },
                price: { type: Number },
                img: { type: String },
                mode: { type: String, enum: ['default', 'extra', 'removed'] }  // حالت انتخابی
            }]
        }],
        default: []
    },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    order_number: { type: Number },
    created_at: { type: Number }  // timestamp
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
