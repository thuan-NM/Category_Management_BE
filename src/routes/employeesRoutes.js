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

const router = express.Router();

router.post('/', controller(createEmployee));
router.get('/', controller(getAllEmployees));
router.get('/count', controller(countEmployees));
router.get('/:id', controller(getEmployeeById));
router.put('/:id', controller(updateEmployee));
router.delete('/:id', controller(deleteEmployee));
router.post('/login', controller(loginEmployee));

export default router;