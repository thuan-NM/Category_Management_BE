// src/controllers/employeeController.js

import {
    createEmployee as createEmployeeService,
    getAllEmployees as getAllEmployeesService,
    getEmployeeById as getEmployeeByIdService,
    updateEmployee as updateEmployeeService,
    deleteEmployee as deleteEmployeeService
} from '../services/employeeService.js';

// Thêm mới nhân viên
const createEmployee = async(req, res) => {
    const employee = await createEmployeeService(req.body);
    res.fly({
        status: 201,
        data: employee,
        code: "employee-s-01",
        message: "Create new employee successfully"
    });
};

// Lấy tất cả nhân viên
const getAllEmployees = async(req, res) => {
    const employees = await getAllEmployeesService();
    res.status(200).json(employees);

};

// Lấy chi tiết một nhân viên theo ID
const getEmployeeById = async(req, res) => {
    const employee = await getEmployeeByIdService(req.params.id);
    if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json(employee);

};

// Cập nhật thông tin nhân viên
const updateEmployee = async(req, res) => {
    const employee = await updateEmployeeService(req.params.id, req.body);
    res.status(200).json(employee);
};

// Xóa nhân viên
const deleteEmployee = async(req, res) => {
    await deleteEmployeeService(req.params.id);
    res.status(204).json();
};

export {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};