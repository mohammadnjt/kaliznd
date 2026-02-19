const router = require('express').Router();
const c = require('../controllers/customer.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.post('/', verifyToken, isAdmin, c.createCustomer);
router.get('/', verifyToken, isAdmin, c.getCustomers);
router.get('/:id', verifyToken, isAdmin, c.getCustomer);
router.put('/:id', verifyToken, isAdmin, c.updateCustomer);
router.delete('/:id', verifyToken, isAdmin, c.deleteCustomer);

module.exports = router;
