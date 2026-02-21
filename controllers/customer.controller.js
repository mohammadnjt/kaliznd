const Customer = require('../models/customers.model');

// CREATE
exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ message: 'خطا در ساخت مشتری', error: err.message });
  }
};

// READ ALL
exports.getCustomers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = ''
    } = req.query;

    const filter = {};

    // سرچ روی نام یا شماره تلفن
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Customer.countDocuments(filter);

    const list = await Customer.find(filter)
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
      message: 'خطا در دریافت مشتری‌ها',
      error: err.message
    });
  }
};

// READ ONE
exports.getCustomer = async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).json({ message: 'مشتری پیدا نشد' });
  res.json(customer);
};

// UPDATE
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ message: 'مشتری پیدا نشد' });
    res.json(customer);
  } catch (err) {
    res.status(400).json({ message: 'خطا در آپدیت مشتری', error: err.message });
  }
};

// DELETE
exports.deleteCustomer = async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return res.status(404).json({ message: 'مشتری پیدا نشد' });
  res.json({ message: 'مشتری حذف شد' });
};
