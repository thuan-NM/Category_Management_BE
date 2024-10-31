import { BorrowingDetails, Book, Borrowing } from '../models/index.js';
import sequelize from '../config/db.config.js';
import createHttpError from 'http-errors';

// Thêm mới BorrowingDetails
const createBorrowingDetails = async(detailsData) => {
    const { borrow_id, book_id } = detailsData;

    // Kiểm tra sự tồn tại của Borrowing và Book
    const borrowing = await Borrowing.findByPk(borrow_id);
    if (!borrowing) {
        throw createHttpError(404, 'Borrowing not found');
    }

    const book = await Book.findByPk(book_id);
    if (!book) {
        throw createHttpError(404, 'Book not found');
    }

    return await BorrowingDetails.create(detailsData);
};

// Lấy tất cả BorrowingDetails với tìm kiếm và sắp xếp
const getAllBorrowingDetails = async(query) => {
    const { search, sortBy, order, page, limit } = query;
    const where = {};

    if (search) {
        where.notes = sequelize.where(
            sequelize.fn('LOWER', sequelize.col('notes')),
            'LIKE',
            `%${search.toLowerCase()}%`
        );
    }

    const offset = page && limit ? (page - 1) * limit : 0;
    const borrowingDetails = await BorrowingDetails.findAndCountAll({
        where,
        order: sortBy ? [
            [sortBy, order === 'desc' ? 'DESC' : 'ASC']
        ] : [],
        include: [Borrowing, Book],
        limit: limit ? parseInt(limit) : undefined,
        offset: offset || undefined,
    });

    return borrowingDetails;
};

// Lấy BorrowingDetails theo ID
const getBorrowingDetailsById = async(id) => {
    const borrowingDetail = await BorrowingDetails.findByPk(id, {
        include: [Borrowing, Book],
    });

    if (!borrowingDetail) {
        throw createHttpError(404, 'Borrowing Detail not found');
    }

    return borrowingDetail;
};

// Cập nhật BorrowingDetails
const updateBorrowingDetails = async(id, updateData) => {
    const transaction = await sequelize.transaction();
    try {
        const borrowingDetail = await getBorrowingDetailsById(id);
        Object.assign(borrowingDetail, updateData);
        await borrowingDetail.save({ transaction });
        await transaction.commit();
        return borrowingDetail;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Xóa BorrowingDetails
const deleteBorrowingDetails = async(id) => {
    const transaction = await sequelize.transaction();
    try {
        const borrowingDetail = await getBorrowingDetailsById(id);
        await borrowingDetail.destroy({ transaction });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Thống kê số lượng sách chưa trả
const getUnreturnedBooksCount = async() => {
    const result = await BorrowingDetails.count({
        where: {
            return_date: null,
        },
    });
    return result;
};

export {
    createBorrowingDetails,
    getAllBorrowingDetails,
    getBorrowingDetailsById,
    updateBorrowingDetails,
    deleteBorrowingDetails,
    getUnreturnedBooksCount,
};