// routes/address.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/address.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.post('/', controller.createAddress);
router.get('/', verifyToken, isAdmin, controller.getAddresses);
// router.get('/:id', controller.getAddressById);
router.put('/:id', controller.updateAddress);
router.delete('/:id', controller.deleteAddress);

module.exports = router;