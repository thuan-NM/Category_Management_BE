// src/controllers/EmployeeController.js

import {
    createEmployee as createEmployeeService,
    getAllEmployees as getAllEmployeesService,
    getEmployeeById as getEmployeeByIdService,
    updateEmployee as updateEmployeeService,
    deleteEmployee as deleteEmployeeService,
    loginEmployee as loginEmployeeService,
    countEmployees as countEmployeesService
} from '../services/employeeService.js';
import createHttpError from 'http-errors';

// Thêm mới Employee
const createEmployee = async(req, res, next) => {
    try {
        const employee = await createEmployeeService(req.body);
        res.status(201).json({
            status: 201,
            data: employee,
            code: 'employee_s_01',
            message: 'Tạo nhân viên mới thành công',
        });
    } catch (error) {
        if (createHttpError.isHttpError(error)) {
            res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                code: 'employee_error',
            });
        } else {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: 'Đã xảy ra lỗi không mong muốn',
                code: 'employee_error_unexpected',
            });
        }
        // Không gọi next(error) sau khi đã gửi phản hồi
    }
};

// Lấy tất cả Employee với tìm kiếm và phân trang
const getAllEmployees = async(req, res, next) => {
    try {
        const employees = await getAllEmployeesService(req.query);
        res.status(200).json({
            status: 200,
            data: employees,
            code: 'employee_s_02',
            message: 'Lấy danh sách nhân viên thành công',
        });
    } catch (error) {
        if (createHttpError.isHttpError(error)) {
            res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                code: 'employee_error',
            });
        } else {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: 'Đã xảy ra lỗi không mong muốn',
                code: 'employee_error_unexpected',
            });
        }
        // Không gọi next(error) sau khi đã gửi phản hồi
    }
};

// Lấy Employee theo ID
const getEmployeeById = async(req, res, next) => {
    try {
        const employee = await getEmployeeByIdService(req.params.id);
        res.status(200).json({
            status: 200,
            data: employee,
            code: 'employee_s_03',
            message: 'Lấy thông tin nhân viên thành công',
        });
    } catch (error) {
        if (createHttpError.isHttpError(error)) {
            res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                code: 'employee_error',
            });
        } else {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: 'Đã xảy ra lỗi không mong muốn',
                code: 'employee_error_unexpected',
            });
        }
        // Không gọi next(error) sau khi đã gửi phản hồi
    }
};

// Cập nhật Employee
const updateEmployee = async(req, res, next) => {
    try {
        const employee = await updateEmployeeService(req.params.id, req.body);
        res.status(200).json({
            status: 200,
            data: employee,
            code: 'employee_s_04',
            message: 'Cập nhật thông tin nhân viên thành công',
        });
    } catch (error) {
        if (createHttpError.isHttpError(error)) {
            res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                code: 'employee_error',
            });
        } else {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: 'Đã xảy ra lỗi không mong muốn',
                code: 'employee_error_unexpected',
            });
        }
        // Không gọi next(error) sau khi đã gửi phản hồi
    }
};

// Xóa Employee
const deleteEmployee = async(req, res, next) => {
    try {
        await deleteEmployeeService(req.params.id);
        res.status(204).send(); // Không gửi body với 204 No Content
    } catch (error) {
        if (createHttpError.isHttpError(error)) {
            res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                code: 'employee_error',
            });
        } else {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: 'Đã xảy ra lỗi không mong muốn',
                code: 'employee_error_unexpected',
            });
        }
        // Không gọi next(error) sau khi đã gửi phản hồi
    }
};

// Đếm số lượng nhân viên
const countEmployees = async(req, res, next) => {
    try {
        const count = await countEmployeesService();
        res.status(200).json({
            status: 200,
            data: count,
            code: 'employee_s_07',
            message: 'Đếm số lượng nhân viên thành công',
        });
    } catch (error) {
        if (createHttpError.isHttpError(error)) {
            res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                code: 'employee_error',
            });
        } else {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: 'Đã xảy ra lỗi không mong muốn',
                code: 'employee_error_unexpected',
            });
        }
        // Không gọi next(error) sau khi đã gửi phản hồi
    }
};

// Đăng nhập Employee
const loginEmployee = async(req, res, next) => {
    try {
        const { username, password } = req.body;
        const { user, token } = await loginEmployeeService(username, password);
        res.status(200).json({
            status: 200,
            data: {
                user,
                token,
            },
            code: 'employee_s_06',
            message: 'Đăng nhập thành công',
        });
    } catch (error) {
        if (createHttpError.isHttpError(error)) {
            // Send error response, do not call `next()` after sending response
            res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                code: 'employee_error',
            });
        } else {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: 'Đã xảy ra lỗi không mong muốn',
                code: 'employee_error_unexpected',
            });
        }
        // Không gọi next(error) sau khi đã gửi phản hồi
    }
};

export {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    loginEmployee,
    countEmployees
};