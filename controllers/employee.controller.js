const bcrypt = require('bcryptjs');
const Employee = require('../models/employee.model');

// CREATE
exports.createEmployee = async (req, res) => {
  try {
    const { name, role, phone, password, gender, birthday } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      name,
      role,
      phone,
      password: hashed,
      gender,
      birthday
    });

    const safe = employee.toObject();
    delete safe.password;

    res.status(201).json(safe);
  } catch (err) {
    res.status(400).json({ message: 'خطا در ساخت کارمند', error: err.message });
  }
};

// READ ALL
exports.getEmployees = async (req, res) => {
  const list = await Employee.find().select('-password').sort({ createdAt: -1 });
  res.json(list);
};

// READ ONE
exports.getEmployee = async (req, res) => {
  const emp = await Employee.findById(req.params.id).select('-password');
  if (!emp) return res.status(404).json({ message: 'کارمند پیدا نشد' });
  res.json(emp);
};

// UPDATE
exports.updateEmployee = async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const emp = await Employee.findByIdAndUpdate(req.params.id, data, { new: true })
      .select('-password');

    if (!emp) return res.status(404).json({ message: 'کارمند پیدا نشد' });

    res.json(emp);
  } catch (err) {
    res.status(400).json({ message: 'خطا در آپدیت کارمند', error: err.message });
  }
};

// DELETE
exports.deleteEmployee = async (req, res) => {
  const emp = await Employee.findByIdAndDelete(req.params.id);
  if (!emp) return res.status(404).json({ message: 'کارمند پیدا نشد' });
  res.json({ message: 'کارمند حذف شد' });
};
