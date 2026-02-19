const Customer = require('../models/customer.model');

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
  const list = await Customer.find().sort({ createdAt: -1 });
  res.json(list);
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
