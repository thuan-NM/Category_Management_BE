import { Publisher, Book } from '../models/index.js';
import createHttpError from 'http-errors';
import sequelize from '../config/db.config.js';

// Thêm mới Publisher
const createPublisher = async(publisherData) => {
    return await Publisher.create(publisherData);
};

// Lấy tất cả Publisher với tìm kiếm và sắp xếp
const getAllPublishers = async (query) => {
    const { publisher_name, email, sortBy, order, page = 1, limit = 10 } = query;

    const where = {};

    // Add search filters
    if (publisher_name) {
        where.publisher_name = {
            [Op.like]: `%${publisher_name}%`, // Case-insensitive search for publisher name
        };
    }

    if (email) {
        where.email = {
            [Op.like]: `%${email}%`, // Case-insensitive search for email
        };
    }

    const offset = (page - 1) * limit;

    try {
        const publishers = await Publisher.findAndCountAll({
            where,
            order: sortBy ? [
                [sortBy, order === 'desc' ? 'DESC' : 'ASC']
            ] : [
                ['publisher_name', 'ASC']
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        return publishers;
    } catch (err) {
        console.error('Error fetching publishers:', err);
        throw new Error('Failed to fetch publishers');
    }
};
// Lấy Publisher theo ID
const getPublisherById = async(id) => {
    const publisher = await Publisher.findByPk(id, { include: [Book] });
    if (!publisher) {
        throw createHttpError(404, 'Publisher not found');
    }
    return publisher;
};

// Cập nhật Publisher với Transaction
const updatePublisher = async(id, updateData) => {
    const transaction = await sequelize.transaction();
    try {
        const publisher = await getPublisherById(id);
        Object.assign(publisher, updateData);
        await publisher.save({ transaction });
        await transaction.commit();
        return publisher;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Xóa Publisher với Trigger để xử lý dữ liệu liên quan
const deletePublisher = async(id) => {
    const transaction = await sequelize.transaction();
    try {
        const publisher = await getPublisherById(id);
        await publisher.destroy({ transaction });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Thống kê số lượng sách theo nhà xuất bản
const getBooksCountByPublisher = async() => {
    const result = await Publisher.findAll({
        attributes: [
            'publisher_id',
            'publisher_name', [sequelize.fn('COUNT', sequelize.col('Books.book_id')), 'books_count'],
        ],
        include: [{
            model: Book,
            attributes: [],
        }],
        group: ['Publisher.publisher_id'],
    });
    return result;
};

// Stored Procedure: Tính tổng số sách của một nhà xuất bản
const getTotalBooksByPublisher = async(publisher_id) => {
    const result = await Publisher.findOne({
        where: { publisher_id },
        attributes: [
            'publisher_id',
            'publisher_name', [sequelize.fn('COUNT', sequelize.col('Books.book_id')), 'total_books'],
        ],
        include: [{
            model: Book,
            attributes: [],
        }],
        group: ['Publisher.publisher_id'],
    });
    return result;
};

export {
    createPublisher,
    getAllPublishers,
    getPublisherById,
    updatePublisher,
    deletePublisher,
    getBooksCountByPublisher,
    getTotalBooksByPublisher,
};