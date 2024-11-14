import { Author, Book } from '../models/index.js';
import sequelize from '../config/db.config.js';
import createHttpError from 'http-errors';
import { Op } from 'sequelize'; // Import Op trực tiếp từ 'sequelize'

// Thêm mới Author
const createAuthor = async(authorData) => {
    return await Author.create(authorData);
};

// Lấy tất cả Author với tìm kiếm và sắp xếp
// const getAllAuthors = async(query = {}) => {
//     const { search, sortBy, order } = query;
//     const where = {};
//     if (search) {
//         where.author_name = sequelize.where(
//             sequelize.fn('LOWER', sequelize.col('author_name')),
//             'LIKE',
//             `%${search.toLowerCase()}%`
//         );
//     }

//     const authors = await Author.findAll({
//         where,
//         order: sortBy ? [
//             [sortBy, order === 'desc' ? 'DESC' : 'ASC']
//         ] : [],
//         include: [Book],
//     });
//     return authors;
// };
const getAllAuthors = async (query) => {
    const { author_name, website, sortBy, order, page = 1, limit = 10 } = query;

    const where = {};

    if (author_name) {
        where.author_name = {
            [Op.like]: `%${author_name}%`
        };
    }

    if (website) {
        where.website = {
            [Op.like]: `%${website}%`
        };
    }

    const offset = (page - 1) * limit;

    const authors = await Author.findAndCountAll({
        where,
        order: sortBy ? [
            [sortBy, order === 'desc' ? 'DESC' : 'ASC']
        ] : [
            ['author_name', 'ASC']
        ],
        attributes: { exclude: ['sensitive_info'] }, // Bỏ thông tin nhạy cảm nếu có
        limit: parseInt(limit),
        offset: parseInt(offset),
    });

    return authors;
};

// Lấy Author theo ID
const getAuthorById = async (id) => {
    try {
        const author = await Author.findByPk(id, {
            include: [Book],  // Thêm thông tin Book liên quan nếu cần
        });
        console.log('author-xx',author)

        // Kiểm tra xem tác giả có tồn tại không
        if (!author) {
            throw createHttpError(404, 'Author not found');
        }

        return author;
    } catch (error) {
        console.error('Error fetching author:', error);
        throw createHttpError(500, 'Internal Server Error');
    }
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
const getAuthorStatistics = async () => {
    try {
        const statistics = await Author.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('author_id')), 'totalAuthors'],
            ],
            raw: true,
        });
        
        return statistics[0];
    } catch (error) {
        console.error('Error fetching author statistics:', error);
        throw error;  // Ném lỗi để controller xử lý
    }
};
export {
    createAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor,
    deleteAuthor,
    getBooksCountByAuthor,
    getAuthorStatistics,
};