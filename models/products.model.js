const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 100 },
    img: { type: String, maxlength: 255 },
    created_at: { type: Date, default: Date.now }
}, { timestamps: true });


const ingredientSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 100 },
    price: { type: Number, default: 0 },  // قیمت اضافی (تومان)
    img: { type: String, maxlength: 255 },
    default: { type: Boolean, default: false },
    removable: { type: Boolean, default: false }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 100 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true },  // قیمت پایه
    is_available: { type: Boolean, default: true },
    product_ingredients: [{  // many-to-many با Ingredients
        ingredient: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
        // می‌تونی فیلدهای اضافی مثل quantity اضافه کنی
    }],
    created_at: { type: Date, default: Date.now }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
const Ingredient = mongoose.model('Ingredient', ingredientSchema);
const Product = mongoose.model('Product', productSchema);


module.exports = {Product, Category, Ingredient}
