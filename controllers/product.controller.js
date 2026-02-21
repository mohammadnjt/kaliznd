const mongoose = require('mongoose');
const { Product, Category, Ingredient } = require('../models/products.model');


// helper
async function getOrCreateCategory(categoryInput) {
  if (!categoryInput) return null;

  // اگر ObjectId بود
  if (mongoose.Types.ObjectId.isValid(categoryInput)) {
    const cat = await Category.findById(categoryInput);
    if (!cat) throw new Error('دسته‌بندی پیدا نشد');
    return cat._id;
  }

  // اگر آبجکت یا اسم بود
  const { name, img } =
    typeof categoryInput === 'string'
      ? { name: categoryInput }
      : categoryInput;

  let cat = await Category.findOne({ name });
  if (!cat) {
    cat = await Category.create({ name, img });
  }

  return cat._id;
}

async function getOrCreateIngredients(productIngredients = []) {
  const result = [];

  for (const item of productIngredients) {
    const { ingredient, amount } = item;

    let ingredientId;

    if (mongoose.Types.ObjectId.isValid(ingredient)) {
      const ing = await Ingredient.findById(ingredient);
      if (!ing) throw new Error(`آیتم با id ${ingredient} پیدا نشد`);
      ingredientId = ing._id;
    } else {
      const { name, price, img } =
        typeof ingredient === 'string'
          ? { name: ingredient }
          : ingredient;

      let ing = await Ingredient.findOne({ name });
      if (!ing) {
        ing = await Ingredient.create({ name, price, img });
      }

      ingredientId = ing._id;
    }

    result.push({
      ingredient: ingredientId,
      amount
    });
  }

  return result;
}

// apis

exports.createProduct = async (req, res) => {
  try {
    const { name, category, img, price, product_ingredients } = req.body;

    const categoryId = await getOrCreateCategory(category);
    const ingredients = await getOrCreateIngredients(product_ingredients);

    const product = await Product.create({
      name,
      category: categoryId,
      img,
      price,
      product_ingredients: ingredients
    });

    const populated = await Product.findById(product._id)
      .populate('category', 'name img')
      .populate('product_ingredients.ingredient', 'name price img');

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({
      message: 'خطا در ساخت محصول',
      error: err.message
    });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const { category, product_ingredients, ...rest } = req.body;

    let updateData = { ...rest };

    if (category) {
      updateData.category = await getOrCreateCategory(category);
    }

    if (product_ingredients) {
      updateData.product_ingredients = await getOrCreateIngredients(product_ingredients);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate('category', 'name img')
      .populate('product_ingredients.ingredient', 'name price img');

    if (!product) {
      return res.status(404).json({ message: 'محصول پیدا نشد' });
    }

    res.json(product);
  } catch (err) {
    res.status(400).json({
      message: 'خطا در ویرایش محصول',
      error: err.message
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      page = 1,
      limit = 10,
      search = ''
    } = req.query;

    const filter = {};

    // فیلتر بر اساس دسته‌بندی
    if (category) {
      filter.category = category; // ObjectId یا string
    }

    // سرچ روی نام محصول
    if (search) {
      filter.name = { $regex: search, $options: 'i' }; // case-insensitive
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // تعداد کل محصولات با این فیلتر
    const total = await Product.countDocuments(filter);

    // لیست محصولات
    const products = await Product.find(filter)
      .populate('category', 'name img')
      .populate('product_ingredients.ingredient', 'name price img')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.json({
      data: products,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber)
      }
    });
  } catch (err) {
    res.status(500).json({
      message: 'خطا در دریافت محصولات',
      error: err.message
    });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'محصول پیدا نشد' });
    }

    res.json({
      message: 'محصول با موفقیت حذف شد',
      deletedId: product._id
    });
  } catch (err) {
    res.status(400).json({
      message: 'خطا در حذف محصول',
      error: err.message
    });
  }
};


// categories
exports.getAllCategories = async (req, res) => {
  try {
    // می‌تونی populate کنی برای محصولات: .populate('products')
    const categories = await Category.find({}).sort({ created_at: -1 });
    
    res.status(200).json({
      message: "دسته‌بندی‌ها با موفقیت دریافت شد",
      categories
    });
  } catch (error) {
    console.error("❌ خطا در دریافت دسته‌بندی‌ها:", error);
    res.status(500).json({ message: "خطای سرور", error: error.message });
  }
};

// حذف یک دسته‌بندی بر اساس ID
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // چک وجود دسته‌بندی
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "دسته‌بندی یافت نشد" });
    }
    
    // حذف (اینجا محصولات مرتبط رو هم چک کن یا cascade delete اگر لازم)
    await Category.findByIdAndDelete(id);
    
    res.status(200).json({
      message: "دسته‌بندی با موفقیت حذف شد",
      deletedId: id
    });
  } catch (error) {
    console.error("❌ خطا در حذف دسته‌بندی:", error);
    res.status(500).json({ message: "خطای سرور", error: error.message });
  }
};


// ingredient
exports.getAllIngredients = async (req, res) => {
  try {
    // می‌تونی فیلتر اضافه کنی، مثل query params
    const ingredients = await Ingredient.find({}).sort({ created_at: -1 });
    
    res.status(200).json({
      message: "مواد تشکیل‌دهنده با موفقیت دریافت شد",
      ingredients
    });
  } catch (error) {
    console.error("❌ خطا در دریافت مواد:", error);
    res.status(500).json({ message: "خطای سرور", error: error.message });
  }
};

// حذف یک ماده بر اساس ID
exports.deleteIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    
    // چک وجود ماده
    const ingredient = await Ingredient.findById(id);
    if (!ingredient) {
      return res.status(404).json({ message: "ماده تشکیل‌دهنده یافت نشد" });
    }
    
    // حذف (چک کن محصولات مرتبط رو، اگر لازم cascade)
    await Ingredient.findByIdAndDelete(id);
    
    res.status(200).json({
      message: "ماده تشکیل‌دهنده با موفقیت حذف شد",
      deletedId: id
    });
  } catch (error) {
    console.error("❌ خطا در حذف ماده:", error);
    res.status(500).json({ message: "خطای سرور", error: error.message });
  }
};