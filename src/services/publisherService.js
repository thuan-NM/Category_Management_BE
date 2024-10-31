import { Publisher, Book } from '../models/index.js';
import createHttpError from 'http-errors';
import sequelize from '../config/db.config.js';

// Thêm mới Publisher
const createPublisher = async(publisherData) => {
    return await Publisher.create(publisherData);
};

// Lấy tất cả Publisher với tìm kiếm và sắp xếp
const getAllPublishers = async(query) => {
    const { search, sortBy, order, page, limit } = query;
    const where = {};
    if (search) {
        where.publisher_name = sequelize.where(
            sequelize.fn('LOWER', sequelize.col('publisher_name')),
            'LIKE',
            `%${search.toLowerCase()}%`
        );
    }

    const offset = page && limit ? (page - 1) * limit : 0;
    const publishers = await Publisher.findAndCountAll({
        where,
        order: sortBy ? [
            [sortBy, order === 'desc' ? 'DESC' : 'ASC']
        ] : [
            ['publisher_name', 'ASC']
        ],
        include: [Book],
        limit: limit ? parseInt(limit) : undefined,
        offset: offset || undefined,
    });
    return publishers;
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