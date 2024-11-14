import {
    Borrowing,
    BorrowingDetails,
    Book,
    LibraryCard,
    Employee,
} from "../models/index.js";
import sequelize from "../config/db.config.js";
import createHttpError from "http-errors";
import { Op } from 'sequelize';
import { getDueDate } from "../helpers/getDueDate.js";

const createBorrowing = async (borrowingData) => {
    const { card_number, employee_id, borrow_date, books, notes } = borrowingData;
    const transaction = await sequelize.transaction();

    try {
        // Fetch the library card
        const libraryCard = await LibraryCard.findByPk(card_number, {
            transaction,
        });

        if (!libraryCard) {
            throw createHttpError(404, 'Library card not found');
        }

        // Check if the library card is locked
        if (libraryCard.is_locked) {
            throw createHttpError(403, 'Library card is locked due to excessive late returns');
        }

        // Proceed with creating the borrowing
        const borrowing = await Borrowing.create(
            { card_number, employee_id, borrow_date },
            { transaction }
        );

        // Kiểm tra từng sách trong `books`
        for (const { book_id, quantity }
            of books) {
            const book = await Book.findByPk(book_id, { transaction });
            if (!book)
                throw createHttpError(404, `Book with id ${book_id} not found`);

            if (book.quantity < quantity) {
                throw createHttpError(
                    400,
                    `Not enough quantity for book with id ${book_id}`
                );
            }

            // Cập nhật quantity trong `Book`
            book.quantity -= quantity;
            await book.save({ transaction });
        }

        // Thêm `BorrowingDetails` với số lượng cho mỗi sách
        // Destructure notes from each book entry
        const borrowingDetailsData = books.map(({ book_id, quantity }) => ({
            borrow_id: borrowing.borrow_id,
            book_id,
            quantity,
            notes: notes || 'Không có', // Use provided notes or default value
        }));

        await BorrowingDetails.bulkCreate(borrowingDetailsData, { transaction });


        // Cập nhật `max_books_allowed` của `LibraryCard`

        libraryCard.max_books_allowed -= books.reduce(
            (sum, { quantity }) => sum + quantity,
            0
        );
        await libraryCard.save({ transaction });

        await transaction.commit();
        return borrowing;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const returnAllBooks = async (borrowId, retryCount = 0) => {
    let transaction;

    try {
        transaction = await sequelize.transaction();

        const borrowing = await Borrowing.findByPk(borrowId, {
            include: [BorrowingDetails],
            transaction,
        });

        if (!borrowing) {
            throw createHttpError(404, 'Borrowing not found');
        }

        const libraryCard = await LibraryCard.findByPk(borrowing.card_number, {
            transaction,
        });

        const updatePromises = borrowing.BorrowingDetails.map(async (detail) => {
            const book = await Book.findByPk(detail.book_id, { transaction });
            if (detail.status === 'borrowed' && !detail.return_date) {
                book.quantity += detail.quantity;
                detail.return_date = new Date();
                detail.status = 'returned';
                libraryCard.max_books_allowed += detail.quantity;

                // Check for overdue
                const dueDate = getDueDate(borrowing.borrow_date);
                if (detail.return_date > dueDate) {
                    // Overdue
                    libraryCard.late_return_count = (libraryCard.late_return_count || 0) + 1;
                    if (libraryCard.late_return_count > 3) {
                        libraryCard.is_locked = true;
                    }
                }
            }
            await detail.save({ transaction });
            await book.save({ transaction });
        });

        await Promise.all(updatePromises);

        borrowing.is_returned = true;
        await borrowing.save({ transaction });
        await libraryCard.save({ transaction });

        await transaction.commit();
        return borrowing;
    } catch (error) {
        if (transaction && !transaction.finished) {
            await transaction.rollback();
        }
        throw error;
    }
};

// Cập nhật lại hàm returnSingleBook
const returnSingleBook = async (borrowDetailId) => {
    const transaction = await sequelize.transaction();
    try {
        const borrowingDetail = await BorrowingDetails.findByPk(borrowDetailId, {
            transaction,
        });

        if (!borrowingDetail || borrowingDetail.return_date) {
            throw createHttpError(404, 'Book not found or already returned');
        }

        const book = await Book.findByPk(borrowingDetail.book_id, { transaction });
        if (!book) {
            throw createHttpError(404, 'Book not found');
        }
        console.log(`Original Book Quantity: ${book.quantity}`);
        book.quantity += borrowingDetail.quantity;
        console.log(`Updated Book Quantity: ${book.quantity}`);
        borrowingDetail.return_date = new Date(); // Mark as returned
        borrowingDetail.status = 'returned';
        await borrowingDetail.save({ transaction });
        await book.save({ transaction });

        // Update the maximum allowed books
        const borrowing = await Borrowing.findByPk(borrowingDetail.borrow_id, {
            transaction,
        });
        if (!borrowing) {
            throw createHttpError(404, 'Borrowing record not found');
        }

        const libraryCard = await LibraryCard.findByPk(borrowing.card_number, {
            transaction,
        });
        if (!libraryCard) {
            throw createHttpError(404, 'Library card not found');
        }
        console.log(`Original Max Books Allowed: ${libraryCard.max_books_allowed}`);
        libraryCard.max_books_allowed += borrowingDetail.quantity;
        console.log(`Updated Max Books Allowed: ${libraryCard.max_books_allowed}`);

        // Check for overdue
        const dueDate = getDueDate(borrowing.borrow_date);
        console.log(`Due Date: ${dueDate}`);
        console.log(`Return Date: ${borrowingDetail.return_date}`);
        if (borrowingDetail.return_date > dueDate) {
            // Overdue
            libraryCard.late_return_count = (libraryCard.late_return_count || 0) + 1;
            console.log(`Late Return Count: ${libraryCard.late_return_count}`);
            if (libraryCard.late_return_count > 3) {
                libraryCard.is_locked = true;
                console.log(`Library card ${libraryCard.card_number} is now locked.`);
            }
        } else {
            console.log('Book returned on time.');
        }

        // Check if all books in the borrowing have been returned
        const allReturned = await BorrowingDetails.findAll({
            where: {
                borrow_id: borrowingDetail.borrow_id,
                return_date: null,
            },
            transaction,
        });

        if (allReturned.length === 0) {
            borrowing.is_returned = true;
            await borrowing.save({ transaction });
            console.log(`All books in borrowing ID ${borrowingDetail.borrow_id} have been returned.`);
        }

        await libraryCard.save({ transaction });
        console.log(`Library card after update:`, libraryCard);

        await transaction.commit();
        return borrowingDetail;
    } catch (error) {
        await transaction.rollback();
        console.error('Error in returnSingleBook:', error);
        throw error;
    }
};

const updateBorrowing = async (id, updateData) => {
    const transaction = await sequelize.transaction();
    try {
        const borrowing = await getBorrowingById(id);
        Object.assign(borrowing, updateData);
        await borrowing.save({ transaction });

        if (updateData.books) {
            // Xóa các BorrowingDetails hiện tại và cập nhật quantity
            const currentDetails = await BorrowingDetails.findAll({
                where: { borrow_id: id },
                transaction,
            });
            for (const detail of currentDetails) {
                const book = await Book.findByPk(detail.book_id, { transaction });
                book.quantity += detail.quantity; // Trả lại quantity cũ
                await book.save({ transaction });
            }
            await BorrowingDetails.destroy({ where: { borrow_id: id }, transaction });

            // Tạo BorrowingDetails mới với số lượng cập nhật
            const borrowingDetailsData = updateData.books.map(
                ({ book_id, quantity }) => ({
                    borrow_id: borrowing.borrow_id,
                    book_id,
                    quantity,
                })
            );
            for (const { book_id, quantity }
                of updateData.books) {
                const book = await Book.findByPk(book_id, { transaction });
                if (book.quantity < quantity)
                    throw createHttpError(400, `Not enough quantity for book ${book_id}`);
                book.quantity -= quantity;
                await book.save({ transaction });
            }
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
const getAllBorrowings = async (query) => {
    const { search, sortBy, order, page, limit } = query;
    const where = {};
    if (search) {
        where.$or = [{
            borrow_id: {
                [sequelize.Op.like]: `%${search}%`,
            },
        },
        {
            "$LibraryCard.card_number$": {
                [sequelize.Op.like]: `%${search}%`,
            },
        },
        {
            "$Employee.full_name$": {
                [sequelize.Op.like]: `%${search}%`,
            },
        },
        ];
    }

    const offset = page && limit ? (page - 1) * limit : 0;
    const borrowings = await Borrowing.findAndCountAll({
        where,
        order: sortBy ? [
            [sortBy, order === "desc" ? "DESC" : "ASC"]
        ] : [
            ["borrow_date", "DESC"]
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
const getBorrowingById = async (id) => {
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
        throw createHttpError(404, "Borrowing not found");
    }
    return borrowing;
};

// Xóa Borrowing với Transaction
const deleteBorrowing = async (id) => {
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
const getMonthlyBorrowings = async () => {
    const result = await Borrowing.findAll({
        attributes: [
            [sequelize.fn("YEAR", sequelize.col("borrow_date")), "year"],
            [sequelize.fn("MONTH", sequelize.col("borrow_date")), "month"],
            [sequelize.fn("COUNT", sequelize.col("borrow_id")), "borrow_count"],
        ],
        group: ["year", "month"],
        order: [
            ["year", "ASC"],
            ["month", "ASC"],
        ],
    });
    return result;
};

// Function: Kiểm tra số lượng sách còn lại
const checkBookAvailability = async (book_id) => {
    // Giả sử có trường 'quantity' trong bảng Books để lưu số lượng sách hiện có
    const book = await Book.findByPk(book_id);
    if (!book) {
        throw createHttpError(404, "Book not found");
    }
    return book.quantity;
};

const updateStatus = async (borrowId, isReturned) => {
    const transaction = await sequelize.transaction();
    try {
        const borrowing = await Borrowing.findByPk(borrowId, { transaction });
        if (!borrowing) throw new Error("Borrowing not found");

        borrowing.is_returned = isReturned;
        await borrowing.save({ transaction });
        await transaction.commit();
        return borrowing;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Hàm lấy thống kê mượn sách theo khoảng thời gian
const getBorrowingStatsByTimeInterval = async (interval) => {
    let dateFormat;
    switch (interval) {
        case 'month':
            dateFormat = '%Y-%m';
            break;
        case 'week':
            dateFormat = '%x-W%v'; // ISO week number
            break;
        case 'year':
            dateFormat = '%Y';
            break;
        default:
            throw createHttpError(400, 'Khoảng thời gian không hợp lệ');
    }

    const stats = await Borrowing.findAll({
        attributes: [
            [sequelize.literal(`DATE_FORMAT(borrow_date, '${dateFormat}')`), 'time'],
            [sequelize.fn('COUNT', sequelize.col('borrow_id')), 'borrow_count'],
        ],
        group: ['time'],
        order: [
            ['time', 'ASC']
        ],
        raw: true,
    });

    return stats;
};



// Hàm lấy danh sách sách được mượn nhiều nhất
const getTopBorrowedBooks = async (limit = 10) => {
    const stats = await BorrowingDetails.findAll({
        attributes: [
            'book_id', [sequelize.fn('SUM', sequelize.col('BorrowingDetails.quantity')), 'total_borrowed'],
        ],
        group: ['BorrowingDetails.book_id'],
        order: [
            [sequelize.literal('total_borrowed'), 'DESC']
        ],
        include: [{
            model: Book,
            attributes: ['title'],
        },],
        limit,
        raw: true,
        nest: true,
    });

    return stats;
};

export {
    createBorrowing,
    getAllBorrowings,
    getBorrowingById,
    updateBorrowing,
    deleteBorrowing,
    getMonthlyBorrowings,
    checkBookAvailability,
    returnAllBooks,
    returnSingleBook,
    updateStatus,
    getBorrowingStatsByTimeInterval,
    getTopBorrowedBooks,
};