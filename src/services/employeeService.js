// src/services/employeeService.js

import { Employee } from '../models/index.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

// Thêm mới nhân viên
const createEmployee = async(employeeData) => {
    const { password } = employeeData;

    // Băm mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
        ...employeeData,
        password: hashedPassword,
    });

    return employee;
};

// Lấy tất cả nhân viên
const getAllEmployees = async() => {
    return await Employee.findAll();
};

// Lấy chi tiết một nhân viên theo ID
const getEmployeeById = async(id) => {
    return await Employee.findByPk(id);
};

// Cập nhật thông tin nhân viên
const updateEmployee = async(id, updateData) => {
    const employee = await Employee.findByPk(id);
    if (!employee) {
        throw createHttpError(404, 'Employee not found');
    }

    Object.assign(employee, updateData);
    await employee.save();

    return employee;
};

// Xóa nhân viên
const deleteEmployee = async(id) => {
    const employee = await Employee.findByPk(id);
    if (!employee) {
        throw createHttpError(404, 'Employee not found');
    }

    await employee.destroy();
};

export {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};