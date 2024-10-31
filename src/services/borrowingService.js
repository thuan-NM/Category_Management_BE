import { Borrowing, BorrowingDetails, Book, LibraryCard, Employee } from '../models/index.js';
import sequelize from '../config/db.config.js';
import createHttpError from 'http-errors';

// Thêm mới Borrowing với Transaction
const createBorrowing = async(borrowingData) => {
    const { card_number, employee_id, borrow_date, books } = borrowingData;
    const transaction = await sequelize.transaction();
    try {
        const borrowing = await Borrowing.create({ card_number, employee_id, borrow_date }, { transaction });

        if (books && books.length > 0) {
            const borrowingDetailsData = books.map((book_id) => ({
                borrow_id: borrowing.borrow_id,
                book_id,
            }));
            await BorrowingDetails.bulkCreate(borrowingDetailsData, { transaction });
        }

        await transaction.commit();
        return borrowing;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Lấy tất cả Borrowing với tìm kiếm và sắp xếp
const getAllBorrowings = async(query) => {
    const { search, sortBy, order, page, limit } = query;
    const where = {};
    if (search) {
        where.$or = [{
                borrow_id: {
                    [sequelize.Op.like]: `%${search}%`
                }
            },
            {
                '$LibraryCard.card_number$': {
                    [sequelize.Op.like]: `%${search}%`
                }
            },
            {
                '$Employee.full_name$': {
                    [sequelize.Op.like]: `%${search}%`
                }
            },
        ];
    }

    const offset = page && limit ? (page - 1) * limit : 0;
    const borrowings = await Borrowing.findAndCountAll({
        where,
        order: sortBy ? [
            [sortBy, order === 'desc' ? 'DESC' : 'ASC']
        ] : [
            ['borrow_date', 'DESC']
        ],
        include: [
            { model: LibraryCard },
            { model: Employee },
            {
                model: BorrowingDetails,
                include: [Book],
            },
        ],
        limit: limit ? parseInt(limit) : undefined,
        offset: offset || undefined,
    });
    return borrowings;
};

// Lấy Borrowing theo ID
const getBorrowingById = async(id) => {
    const borrowing = await Borrowing.findByPk(id, {
        include: [
            { model: LibraryCard },
            { model: Employee },
            {
                model: BorrowingDetails,
                include: [Book],
            },
        ],
    });
    if (!borrowing) {
        throw createHttpError(404, 'Borrowing not found');
    }
    return borrowing;
};

// Cập nhật Borrowing với Transaction
const updateBorrowing = async(id, updateData) => {
    const transaction = await sequelize.transaction();
    try {
        const borrowing = await getBorrowingById(id);
        Object.assign(borrowing, updateData);
        await borrowing.save({ transaction });

        if (updateData.books) {
            // Xóa các BorrowingDetails hiện tại
            await BorrowingDetails.destroy({ where: { borrow_id: id }, transaction });

            // Thêm lại BorrowingDetails mới
            const borrowingDetailsData = updateData.books.map((book_id) => ({
                borrow_id: borrowing.borrow_id,
                book_id,
            }));
            await BorrowingDetails.bulkCreate(borrowingDetailsData, { transaction });
        }

        await transaction.commit();
        return borrowing;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Xóa Borrowing với Transaction
const deleteBorrowing = async(id) => {
    const transaction = await sequelize.transaction();
    try {
        const borrowing = await getBorrowingById(id);
        await borrowing.destroy({ transaction });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Thống kê số lượng mượn sách theo tháng
const getMonthlyBorrowings = async() => {
    const result = await Borrowing.findAll({
        attributes: [
            [sequelize.fn('YEAR', sequelize.col('borrow_date')), 'year'],
            [sequelize.fn('MONTH', sequelize.col('borrow_date')), 'month'],
            [sequelize.fn('COUNT', sequelize.col('borrow_id')), 'borrow_count'],
        ],
        group: ['year', 'month'],
        order: [
            ['year', 'ASC'],
            ['month', 'ASC']
        ],
    });
    return result;
};

// Function: Kiểm tra số lượng sách còn lại
const checkBookAvailability = async(book_id) => {
    // Giả sử có trường 'stock' trong bảng Books để lưu số lượng sách hiện có
    const book = await Book.findByPk(book_id);
    if (!book) {
        throw createHttpError(404, 'Book not found');
    }
    return book.stock;
};

// Trigger: Giảm số lượng sách khi mượn và tăng khi trả
// Bạn cần tạo trigger trong MySQL hoặc xử lý trong service

export {
    createBorrowing,
    getAllBorrowings,
    getBorrowingById,
    updateBorrowing,
    deleteBorrowing,
    getMonthlyBorrowings,
    checkBookAvailability,
};