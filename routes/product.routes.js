const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// // Category
// router.post('/categories', verifyToken, isAdmin, productController.createCategory);
// router.get('/categories', productController.getCategories);
// router.get('/categories/:id', productController.getCategory);
// router.put('/categories/:id', verifyToken, isAdmin, productController.updateCategory);
// router.delete('/categories/:id', verifyToken, isAdmin, productController.deleteCategory);

// Ingredient
// router.post('/ingredients', verifyToken, isAdmin, productController.createIngredient);
// router.get('/ingredients', productController.getIngredients);
// router.get('/ingredients/:id', productController.getIngredient);
// router.put('/ingredients/:id', verifyToken, isAdmin, productController.updateIngredient);
// router.delete('/ingredients/:id', verifyToken, isAdmin, productController.deleteIngredient);


/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product CRUD API
 */



// Product
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create product (auto create category & ingredients)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/', productController.createProduct);
// router.post('/', verifyToken, isAdmin, productController.createProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category id
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', productController.getProducts);
// router.get('/:id', productController.getProduct);
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Updated product
 */
router.put('/:id', verifyToken, isAdmin, productController.updateProduct);
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);

// categories
router.get('/category', verifyToken, isAdmin, productController.getAllCategories);
router.delete('/category/:id', verifyToken, isAdmin, productController.deleteCategory);

// ingredient
router.get('/ingredient', verifyToken, isAdmin, productController.getAllIngredients);
router.delete('/category/:id', verifyToken, isAdmin, productController.deleteIngredient);

module.exports = router;