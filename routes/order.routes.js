const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: orders CRUD API
 */

// Product
router.post('/', productController.createProduct);
router.get('/', productController.getProducts);

module.exports = router;