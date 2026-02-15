const Employee = require('../models/employee.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';

// ثبت ادمین
exports.registerAdmin = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: 'نام و پسورد الزامی است' });
    }

    const exists = phone
      ? await Employee.findOne({ phone })
      : null;

    if (exists) {
      return res.status(409).json({ message: 'این شماره قبلا ثبت شده' });
    }

    const hash = await bcrypt.hash(password, 10);

    const admin = await Employee.create({
      name,
      phone,
      password: hash,
      role: 'admin',
    });

    res.status(201).json({
      message: 'ادمین با موفقیت ساخته شد',
      data: {
        id: admin._id,
        name: admin.name,
        role: admin.role,
        phone: admin.phone,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطای سرور' });
  }
};

// لاگین
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await Employee.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: 'کاربر یافت نشد' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'رمز عبور اشتباه است' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطای سرور' });
  }
};

// گرفتن پروفایل
exports.getProfile = async (req, res) => {
  try {
    const user = await Employee.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'کاربر پیدا نشد' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'خطای سرور' });
  }
};

// تغییر رمز عبور
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await Employee.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'کاربر پیدا نشد' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'رمز فعلی اشتباه است' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'رمز عبور با موفقیت تغییر کرد' });
  } catch (err) {
    res.status(500).json({ message: 'خطای سرور' });
  }
};
