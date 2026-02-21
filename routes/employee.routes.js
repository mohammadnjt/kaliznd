const router = require('express').Router();
const c = require('../controllers/employee.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.post('/', verifyToken, isAdmin, c.createEmployee);
router.get('/', verifyToken, isAdmin, c.getEmployees);
router.get('/:id', verifyToken, c.getEmployee);
router.put('/:id', verifyToken, isAdmin, c.updateEmployee);
router.delete('/:id', verifyToken, isAdmin, c.deleteEmployee);

module.exports = router;
