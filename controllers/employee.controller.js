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
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role // فیلتر اختیاری روی نقش: admin | cashier
    } = req.query;

    const filter = {};

    // فیلتر بر اساس نقش
    if (role) {
      filter.role = role;
    }

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

    const total = await Employee.countDocuments(filter);

    const list = await Employee.find(filter)
      .select('-password')
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
    console.log("err", err)
    res.status(500).json({
      message: 'خطا در دریافت کارکنان',
      error: err.message
    });
  }
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
