import { Author, Book } from '../models/index.js';
import sequelize from '../config/db.config.js';
import createHttpError from 'http-errors';

// Thêm mới Author
const createAuthor = async(authorData) => {
    return await Author.create(authorData);
};

// Lấy tất cả Author với tìm kiếm và sắp xếp
const getAllAuthors = async(query = {}) => {
    const { search, sortBy, order } = query;
    const where = {};
    if (search) {
        where.author_name = sequelize.where(
            sequelize.fn('LOWER', sequelize.col('author_name')),
            'LIKE',
            `%${search.toLowerCase()}%`
        );
    }

    const authors = await Author.findAll({
        where,
        order: sortBy ? [
            [sortBy, order === 'desc' ? 'DESC' : 'ASC']
        ] : [],
        include: [Book],
    });
    return authors;
};

// Lấy Author theo ID
const getAuthorById = async(id) => {
    const author = await Author.findByPk(id, { include: [Book] });
    if (!author) {
        throw createHttpError(404, 'Author not found');
    }
    return author;
};

// Cập nhật Author với Transaction
const updateAuthor = async(id, updateData) => {
    const transaction = await sequelize.transaction();
    try {
        const author = await getAuthorById(id);
        Object.assign(author, updateData);
        await author.save({ transaction });
        await transaction.commit();
        return author;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Xóa Author với Trigger để xử lý dữ liệu liên quan
const deleteAuthor = async(id) => {
    const transaction = await sequelize.transaction();
    try {
        const author = await getAuthorById(id);
        await author.destroy({ transaction });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Thống kê số lượng sách theo tác giả
const getBooksCountByAuthor = async() => {
    const result = await Author.findAll({
        attributes: [
            'author_id',
            'author_name', [sequelize.fn('COUNT', sequelize.col('Books.book_id')), 'books_count'],
        ],
        include: [{
            model: Book,
            attributes: [],
        }],
        group: ['Author.author_id'],
    });
    return result;
};

export {
    createAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor,
    deleteAuthor,
    getBooksCountByAuthor,
};