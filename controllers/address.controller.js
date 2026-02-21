// controllers/address.controller.js
const Address = require('../models/address.model');

exports.createAddress = async (req, res) => {
  try {
    const { region, neighborhood, price } = req.body;

    const address = await Address.create({ region, neighborhood, price });

    res.status(201).json(address);
  } catch (err) {
    // خطای تکراری
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'این منطقه و محله قبلاً ثبت شده است'
      });
    }

    res.status(500).json({
      message: 'خطا در ایجاد آدرس',
      error: err.message
    });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { region, neighborhood, price } = req.body;

    const updated = await Address.findByIdAndUpdate(
      id,
      { region, neighborhood, price },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'آدرس پیدا نشد' });
    }

    res.json(updated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'این منطقه و محله قبلاً ثبت شده است'
      });
    }

    res.status(500).json({
      message: 'خطا در ویرایش آدرس',
      error: err.message
    });
  }
};
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Address.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'آدرس پیدا نشد' });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({
      message: 'خطا در حذف آدرس',
      error: err.message
    });
  }
};

exports.getAddresses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      minPrice,
      maxPrice
    } = req.query;

    const filter = {};

    // سرچ روی منطقه یا محله
    if (search) {
      filter.$or = [
        { region: { $regex: search, $options: 'i' } },
        { neighborhood: { $regex: search, $options: 'i' } }
      ];
    }

    // فیلتر قیمت
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Address.countDocuments(filter);

    const list = await Address.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.json({
      data: list,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber)
      }
    });
  } catch (err) {
    res.status(500).json({
      message: 'خطا در دریافت لیست آدرس‌ها',
      error: err.message
    });
  }
};