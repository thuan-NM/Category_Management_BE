// src/services/employeeService.js

import { Op } from 'sequelize'; // Import Op trực tiếp từ 'sequelize'
import { Employee } from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import sequelize from '../config/db.config.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

// Thêm mới Employee với Transaction
const createEmployee = async(employeeData) => {
    const { password } = employeeData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const transaction = await sequelize.transaction();
    try {
        const employee = await Employee.create({
            ...employeeData,
            password: hashedPassword,
        }, { transaction });
        await transaction.commit();
        return employee;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Lấy tất cả Employee với tìm kiếm và phân trang
const getAllEmployees = async(query) => {
    const { full_name, phone_number, sortBy, order, page = 1, limit = 10 } = query;

    const where = {};

    if (full_name) {
        where.full_name = {
            [Op.like]: `%${full_name}%`
        };
    }

    if (phone_number) {
        where.phone_number = {
            [Op.like]: `%${phone_number}%`
        };
    }

    const offset = (page - 1) * limit;

    const employees = await Employee.findAndCountAll({
        where,
        order: sortBy ? [
            [sortBy, order === 'desc' ? 'DESC' : 'ASC']
        ] : [
            ['full_name', 'ASC']
        ],
        attributes: { exclude: ['password'] }, // Bỏ mật khẩu khỏi kết quả
        limit: parseInt(limit),
        offset: parseInt(offset),
    });

    return employees;
};

// Các hàm khác không thay đổi
const getEmployeeById = async(id) => {
    const employee = await Employee.findByPk(id, {
        attributes: { exclude: ['password'] },
    });
    if (!employee) {
        throw createHttpError(404, 'Employee not found');
    }
    return employee;
};

const updateEmployee = async(id, updateData) => {
    const transaction = await sequelize.transaction();
    try {
        const employee = await getEmployeeById(id);

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        Object.assign(employee, updateData);
        await employee.save({ transaction });

        await transaction.commit();
        return employee;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const deleteEmployee = async(id) => {
    const transaction = await sequelize.transaction();
    try {
        const employee = await getEmployeeById(id);
        await employee.destroy({ transaction });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const loginEmployee = async(username, password) => {
    const employee = await Employee.findOne({ where: { username } });
    if (!employee) {
        throw createHttpError(401, 'Thông tin đăng nhập không hợp lệ'); // Thông báo hợp nhất cho bảo mật
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
        throw createHttpError(401, 'Thông tin đăng nhập không hợp lệ');
    }

    // Tạo token JWT với payload giới hạn
    const token = jwt.sign({
            id: employee.employee_id,
            role: employee.role,
        },
        JWT_SECRET, { expiresIn: '10h' }
    );

    return {
        user: {
            employee_id: employee.employee_id,
            full_name: employee.full_name,
            phone_number: employee.phone_number,
            role: employee.role,
            birth_date: employee.birth_date,
        },
        token,
    };
};

// Function: Đếm số lượng nhân viên
const countEmployees = async() => {
    const count = await Employee.count();
    return count;
};

export {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    loginEmployee,
    countEmployees,
};