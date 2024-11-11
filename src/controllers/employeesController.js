import createHttpError from 'http-errors';
import {
    createEmployee as createEmployeeService,
    getAllEmployees as getAllEmployeesService,
    getEmployeeById as getEmployeeByIdService,
    updateEmployee as updateEmployeeService,
    deleteEmployee as deleteEmployeeService,
    loginEmployee as loginEmployeeService,
    countEmployees as countEmployeesService
} from '../services/employeeService.js';

// Thêm mới Employee
const createEmployee = async(req, res) => {
    const employee = await createEmployeeService(req.body);
    res.fly({
        status: 201,
        data: employee,
        code: 'employee_s_01',
        message: 'Create new employee successfully'
    });
};

// Lấy tất cả Employee
const getAllEmployees = async(req, res) => {
    const employees = await getAllEmployeesService(req.query);
    res.fly({
        status: 200,
        data: employees,
        code: 'employee_s_02',
        message: 'Get all employees successfully'
    });
};

// Lấy Employee theo ID
const getEmployeeById = async(req, res) => {
    const employee = await getEmployeeByIdService(req.params.id);
    res.fly({
        status: 200,
        data: employee,
        code: 'employee_s_03',
        message: 'Get employee successfully'
    });
};

// Cập nhật Employee
const updateEmployee = async(req, res) => {
    const employee = await updateEmployeeService(req.params.id, req.body);
    res.fly({
        status: 200,
        data: employee,
        code: 'employee_s_04',
        message: 'Update employee successfully'
    });
};

// Xóa Employee
const deleteEmployee = async(req, res) => {
    await deleteEmployeeService(req.params.id);
    res.fly({
        status: 204,
        code: 'employee_s_05',
        message: 'Delete employee successfully'
    });
};

// Đăng nhập Employee
const loginEmployee = async(req, res) => {
    try {
        const { username, password } = req.body;
        const employee = await loginEmployeeService(username, password);
        res.status(200).json({
            status: 200,
            data: employee,
            code: 'employee_s_06',
            message: 'Login employee successfully'
        });
    } catch (error) {
        if (error instanceof createHttpError.HttpError) {
            // Handle known error thrown by service
            res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                code: 'employee_error'
            });
        } else {
            // Handle unknown errors
            res.status(500).json({
                status: 500,
                message: 'An unexpected error occurred',
                code: 'employee_error_unexpected'
            });
        }
    }
};
// Đếm số lượng nhân viên
const countEmployees = async(req, res) => {
    const count = await countEmployeesService();
    res.fly({
        status: 200,
        data: count,
        code: 'employee_s_07',
        message: 'Count employees successfully'
    });
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