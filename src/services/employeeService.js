import jwt from 'jsonwebtoken';
import { Employee } from '../models/index.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import sequelize from '../config/db.config.js';

const JWT_SECRET = process.env.JWT_SECRET
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

// Lấy tất cả Employee với tìm kiếm và sắp xếp
const getAllEmployees = async(query) => {
    const { search, sortBy, order, page, limit } = query;
    const where = {};
    if (search) {
        where.$or = [{
                full_name: {
                    [sequelize.Op.like]: `%${search}%`
                }
            },
            {
                phone_number: {
                    [sequelize.Op.like]: `%${search}%`
                }
            },
            {
                username: {
                    [sequelize.Op.like]: `%${search}%`
                }
            },
        ];
    }

    const offset = page && limit ? (page - 1) * limit : 0;
    const employees = await Employee.findAndCountAll({
        where,
        order: sortBy ? [
            [sortBy, order === 'desc' ? 'DESC' : 'ASC']
        ] : [
            ['full_name', 'ASC']
        ],
        attributes: { exclude: ['password'] }, // Bỏ mật khẩu khỏi kết quả
        limit: limit ? parseInt(limit) : undefined,
        offset: offset || undefined,
    });
    return employees;
};

// Lấy Employee theo ID
const getEmployeeById = async(id) => {
    const employee = await Employee.findByPk(id, {
        attributes: { exclude: ['password'] },
    });
    if (!employee) {
        throw createHttpError(404, 'Employee not found');
    }
    return employee;
};

// Cập nhật Employee với Transaction
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

// Xóa Employee với Trigger để xử lý dữ liệu liên quan
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

// Stored Procedure: Đăng nhập Employee
const loginEmployee = async(username, password) => {
    const employee = await Employee.findOne({ where: { username } });
    if (!employee) {
        throw createHttpError(404, 'Employee not found');
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
        throw createHttpError(401, 'Invalid credentials');
    }
    // Generate a JWT token
    const token = jwt.sign({
            id: employee.id,
            user: employee,
        },
        JWT_SECRET, { expiresIn: '10h' } // Token expires in 1 hour
    );

    return {
        user: {
            full_name: employee.full_name,
            phone_number: employee.phone_number,
            email: employee.email,
            role: employee.role,
            dob: employee.birth_date,
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