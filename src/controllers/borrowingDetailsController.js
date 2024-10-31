import {
    createBorrowingDetails as createBorrowingDetailsService,
    getAllBorrowingDetails as getAllBorrowingDetailsService,
    getBorrowingDetailsById as getBorrowingDetailsByIdService,
    updateBorrowingDetails as updateBorrowingDetailsService,
    deleteBorrowingDetails as deleteBorrowingDetailsService,
    getUnreturnedBooksCount as getUnreturnedBooksCountService
} from '../services/borrowingDetailsService.js';

// Thêm mới BorrowingDetails
const createBorrowingDetails = async(req, res) => {
    const borrowingDetail = await createBorrowingDetailsService(req.body);
    res.fly({
        status: 201,
        data: borrowingDetail,
        code: 'borrowingdetail_s_01',
        message: 'Create new borrowing detail successfully'
    });
};

// Lấy tất cả BorrowingDetails
const getAllBorrowingDetails = async(req, res) => {
    const borrowingDetails = await getAllBorrowingDetailsService(req.query);
    res.fly({
        status: 200,
        data: borrowingDetails,
        code: 'borrowingdetail_s_02',
        message: 'Get all borrowing details successfully'
    });
};

// Lấy BorrowingDetails theo ID
const getBorrowingDetailsById = async(req, res) => {
    const borrowingDetail = await getBorrowingDetailsByIdService(req.params.id);
    res.fly({
        status: 200,
        data: borrowingDetail,
        code: 'borrowingdetail_s_03',
        message: 'Get borrowing detail successfully'
    });
};

// Cập nhật BorrowingDetails
const updateBorrowingDetails = async(req, res) => {
    const borrowingDetail = await updateBorrowingDetailsService(req.params.id, req.body);
    res.fly({
        status: 200,
        data: borrowingDetail,
        code: 'borrowingdetail_s_04',
        message: 'Update borrowing detail successfully'
    });
};

// Xóa BorrowingDetails
const deleteBorrowingDetails = async(req, res) => {
    await deleteBorrowingDetailsService(req.params.id);
    res.fly({
        status: 204,
        code: 'borrowingdetail_s_05',
        message: 'Delete borrowing detail successfully'
    });
};

// Thống kê số lượng sách chưa trả
const getUnreturnedBooksCount = async(req, res) => {
    const result = await getUnreturnedBooksCountService();
    res.fly({
        status: 200,
        data: result,
        code: 'borrowingdetail_s_06',
        message: 'Get unreturned books count successfully'
    });
};

export {
    createBorrowingDetails,
    getAllBorrowingDetails,
    getBorrowingDetailsById,
    updateBorrowingDetails,
    deleteBorrowingDetails,
    getUnreturnedBooksCount,
};