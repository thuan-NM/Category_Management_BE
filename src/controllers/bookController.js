// controllers/bookController.js

import {
    createBook as createBookService,
    getAllBooks as getAllBooksService,
    getBookById as getBookByIdService,
    updateBook as updateBookService,
    deleteBook as deleteBookService,
} from '../services/bookService.js';

// Thêm mới Book
const createBook = async (req, res, next) => {
    try {
        const book = await createBookService(req.body);
        res.fly({
            status: 201,
            data: book,
            code: 'book_s_01',
            message: 'Create new book successfully',
        });
    } catch (error) {
        next(error);
    }
};

// Lấy tất cả Book với các tham số truy vấn
const getAllBooks = async (req, res, next) => {
    try {
        const books = await getAllBooksService(req.query);
        res.fly({
            status: 200,
            data: books,
            code: 'book_s_02',
            message: 'Get all books successfully',
        });
    } catch (error) {
        next(error);
    }
};

// Lấy Book theo ID
const getBookById = async (req, res, next) => {
    try {
        const book = await getBookByIdService(req.params.id);
        res.fly({
            status: 200,
            data: book,
            code: 'book_s_03',
            message: 'Get book successfully',
        });
    } catch (error) {
        next(error);
    }
};

// Cập nhật Book
const updateBook = async (req, res, next) => {
    try {
        const book = await updateBookService(req.params.id, req.body);
        res.fly({
            status: 200,
            data: book,
            code: 'book_s_04',
            message: 'Update book successfully',
        });
    } catch (error) {
        next(error);
    }
};

// Xóa Book
const deleteBook = async (req, res, next) => {
    try {
        await deleteBookService(req.params.id);
        res.fly({
            status: 204,
            code: 'book_s_05',
            message: 'Delete book successfully',
        });
    } catch (error) {
        next(error);
    }
};

export {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
};
