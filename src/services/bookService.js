// src/services/bookService.js

import { Book, Author, Genre, Publisher, BorrowingDetails } from '../models/index.js';
import sequelize from '../config/db.config.js';
import { Op } from 'sequelize'; // Ensure Op is imported
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

// Lấy tất cả Book với tìm kiếm, sắp xếp, phân trang và lọc
// Lấy tất cả Book với tìm kiếm, sắp xếp, phân trang và lọc
const getAllBooks = async(query = {}) => {
    const {
        title = '',
            genre = '',
            author = '',
            publisher = '',
            publicationYearFrom = '',
            publicationYearTo = '',
            inStock = false,
            sortBy = 'title',
            order = 'asc',
            page = 1,
            limit,
    } = query;

    const where = {};

    // Filter by Title
    if (title) {
        where.title = {
            [Op.like]: `%${title}%`,
        };
    }

    // Filter by Publication Year Range
    if (publicationYearFrom || publicationYearTo) {
        where.publication_year = {};
        if (publicationYearFrom) {
            where.publication_year[Op.gte] = parseInt(publicationYearFrom);
        }
        if (publicationYearTo) {
            where.publication_year[Op.lte] = parseInt(publicationYearTo);
        }
    }

    // Filter by In Stock
    if (inStock === 'true' || inStock === true) {
        where.quantity = {
            [Op.gt]: 0
        };
    }

    // Include conditions for Genre, Author, Publisher
    const include = [];
    if (author) {
        include.push({
            model: Author,
            where: {
                author_name: {
                    [Op.like]: `%${author}%`,
                },
            },
        });
    } else {
        include.push({ model: Author });
    }

    if (genre) {
        include.push({
            model: Genre,
            where: {
                genre_name: {
                    [Op.like]: `%${genre}%`,
                },
            },
        });
    } else {
        include.push({ model: Genre });
    }

    if (publisher) {
        include.push({
            model: Publisher,
            where: {
                publisher_name: {
                    [Op.like]: `%${publisher}%`,
                },
            },
        });
    } else {
        include.push({ model: Publisher });
    }

    // Adjust sortBy to handle associated model fields
    let orderOption = [];
    if (sortBy) {
        switch (sortBy) {
            case 'author':
                orderOption.push([{ model: Author }, 'author_name', order.toUpperCase()]);
                break;
            case 'genre':
                orderOption.push([{ model: Genre }, 'genre_name', order.toUpperCase()]);
                break;
            case 'publisher':
                orderOption.push([{ model: Publisher }, 'publisher_name', order.toUpperCase()]);
                break;
            default:
                orderOption.push([sortBy, order.toUpperCase()]);
        }
    }

    // Pagination logic
    const paginationOptions = {};
    if (limit && parseInt(limit) > 0) {
        paginationOptions.limit = parseInt(limit);
        paginationOptions.offset = (page - 1) * parseInt(limit);
    }

    // Query database
    const books = await Book.findAndCountAll({
        where,
        include,
        order: orderOption.length ? orderOption : [
            ['title', 'ASC']
        ],
        ...paginationOptions,
        distinct: true,
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

// Xóa Book với Transaction
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