const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// ثبت‌نام کاربر جدید
router.post('/register-admin', authController.registerAdmin);
router.post('/login', authController.login);
router.get('/me', verifyToken, authController.getProfile);
router.post('/change-password', verifyToken, authController.changePassword);

module.exports = router;