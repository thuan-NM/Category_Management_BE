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
            message: 'Create new employee successfully',
        });
    } catch (error) {
        if (error instanceof createHttpError.HttpError) {
            res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                code: 'employee_error',
            });
        } else {
            res.status(500).json({
                status: 500,
                message: 'An unexpected error occurred',
                code: 'employee_error_unexpected',
            });
        }
        next(error);
    }
};

// Lấy tất cả Employee
const getAllEmployees = async(req, res, next) => {
    try {
        const employees = await getAllEmployeesService(req.query);
        res.status(200).json({
            status: 200,
            data: employees,
            code: 'employee_s_02',
            message: 'Get all employees successfully',
        });
    } catch (error) {
        if (error instanceof createHttpError.HttpError) {
            res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                code: 'employee_error',
            });
        } else {
            res.status(500).json({
                status: 500,
                message: 'An unexpected error occurred',
                code: 'employee_error_unexpected',
            });
        }
        next(error);
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
            message: 'Get employee successfully',
        });
    } catch (error) {
        if (error instanceof createHttpError.HttpError) {
            res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                code: 'employee_error',
            });
        } else {
            res.status(500).json({
                status: 500,
                message: 'An unexpected error occurred',
                code: 'employee_error_unexpected',
            });
        }
        next(error);
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
            message: 'Update employee successfully',
        });
    } catch (error) {
        if (error instanceof createHttpError.HttpError) {
            res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                code: 'employee_error',
            });
        } else {
            res.status(500).json({
                status: 500,
                message: 'An unexpected error occurred',
                code: 'employee_error_unexpected',
            });
        }
        next(error);
    }
};

// Xóa Employee
const deleteEmployee = async(req, res, next) => {
    try {
        await deleteEmployeeService(req.params.id);
        res.status(204).json({
            status: 204,
            code: 'employee_s_05',
            message: 'Delete employee successfully',
        });
    } catch (error) {
        if (error instanceof createHttpError.HttpError) {
            res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                code: 'employee_error',
            });
        } else {
            res.status(500).json({
                status: 500,
                message: 'An unexpected error occurred',
                code: 'employee_error_unexpected',
            });
        }
        next(error);
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
            message: 'Count employees successfully',
        });
    } catch (error) {
        if (error instanceof createHttpError.HttpError) {
            res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                code: 'employee_error',
            });
        } else {
            res.status(500).json({
                status: 500,
                message: 'An unexpected error occurred',
                code: 'employee_error_unexpected',
            });
        }
        next(error);
    }
};
// Đăng nhập Employee
const loginEmployee = async(req, res, next) => {
    try {
        const { username, password } = req.body;
        const { user, token } = await loginEmployeeService(username, password);
        console.log('User:', user);
        res.status(200).json({
            status: 200,
            data: {
                user,
                token,
            },
            code: 'employee_s_06',
            message: 'Login employee successfully',
        });
    } catch (error) {
        if (error instanceof createHttpError.HttpError) {
            // Send error response, do not call `next()` after sending response
            return res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                code: 'employee_error',
            });
        }

        // For unexpected errors, use `next` to pass control to the error-handling middleware
        next(error);
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