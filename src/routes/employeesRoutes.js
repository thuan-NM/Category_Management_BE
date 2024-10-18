import express from 'express';
import { createEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee } from '../controllers/employeesController.js';
import controller from "../middlewares/controller.js"
const router = express.Router();

// Route thêm mới nhân viên
router.post('/', controller(createEmployee));

// Route lấy danh sách tất cả nhân viên
router.get('/', controller(getAllEmployees));

// Route lấy thông tin một nhân viên theo ID
router.get('/:id', controller(getEmployeeById));

// Route cập nhật thông tin nhân viên
router.put('/:id', controller(updateEmployee));

// Route xóa nhân viên
router.delete('/:id', controller(deleteEmployee));

export default router;