import { Book, Author, Genre, Publisher, BorrowingDetails } from '../models/index.js';
import sequelize from '../config/db.config.js';
import createHttpError from 'http-errors';

// Thêm mới Book với Transaction
const createBook = async(bookData) => {
    const transaction = await sequelize.transaction();
    try {
        const book = await Book.create(bookData, { transaction });
        await transaction.commit();
        return book;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Lấy tất cả Book với tìm kiếm, sắp xếp và phân trang
const getAllBooks = async(query = {}) => {
    const { search, sortBy, order, page, limit } = query;
    const where = {};

    if (search) {
        where.title = sequelize.where(
            sequelize.fn('LOWER', sequelize.col('title')),
            'LIKE',
            `%${search.toLowerCase()}%`
        );
    }

    const offset = page && limit ? (page - 1) * limit : 0;

    const books = await Book.findAndCountAll({
        where,
        order: sortBy ? [
            [sortBy, order === 'desc' ? 'DESC' : 'ASC']
        ] : [],
        include: [Author, Genre, Publisher],
        limit: limit ? parseInt(limit) : undefined,
        offset: offset || undefined,
    });

    return books;
};


// Lấy Book theo ID
const getBookById = async(id) => {
    const book = await Book.findByPk(id, {
        include: [Author, Genre, Publisher, BorrowingDetails],
    });
    if (!book) {
        throw createHttpError(404, 'Book not found');
    }
    return book;
};

// Cập nhật Book với Transaction
const updateBook = async(id, updateData) => {
    const transaction = await sequelize.transaction();
    try {
        const book = await getBookById(id);
        Object.assign(book, updateData);
        await book.save({ transaction });
        await transaction.commit();
        return book;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Xóa Book với Trigger để xử lý dữ liệu liên quan
const deleteBook = async(id) => {
    const transaction = await sequelize.transaction();
    try {
        const book = await getBookById(id);
        await book.destroy({ transaction });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Thống kê số lượng sách theo thể loại
const getBooksCountByGenre = async() => {
    const result = await Genre.findAll({
        attributes: [
            'genre_id',
            'genre_name', [sequelize.fn('COUNT', sequelize.col('Books.book_id')), 'books_count'],
        ],
        include: [{
            model: Book,
            attributes: [],
        }],
        group: ['Genre.genre_id'],
    });
    return result;
};

// Stored Procedure: Thêm nhiều sách cùng lúc
const createBooksBulk = async(booksData) => {
    const transaction = await sequelize.transaction();
    try {
        const books = await Book.bulkCreate(booksData, { transaction });
        await transaction.commit();
        return books;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
    getBooksCountByGenre,
    createBooksBulk,
};