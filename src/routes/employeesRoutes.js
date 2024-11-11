// src/routes/employees.js
import express from 'express';
import {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    loginEmployee,
    countEmployees
} from '../controllers/employeesController.js';
import { controller } from '../middlewares/index.js';
import auth from '../middlewares/auth.js'; // Import auth middleware
import roleCheck from '../middlewares/roleCheck.js'; // Import role check middleware

const router = express.Router();

router.post('/login', controller(loginEmployee));
router.use(auth); // Apply auth middleware to all routes below this line

// CRUD operations that require authentication
router.use(auth); // Apply auth middleware to all routes below this line

router.post('/', roleCheck('admin'), controller(createEmployee));
router.get('/', controller(getAllEmployees));
router.get('/count', controller(countEmployees));
router.get('/:id', controller(getEmployeeById));
router.put('/:id', roleCheck('admin'), controller(updateEmployee));
router.delete('/:id', roleCheck('admin'), controller(deleteEmployee));

export default router;