import { Reader, LibraryCard } from '../models/index.js';
import sequelize from '../config/db.config.js';
import createHttpError from 'http-errors';

// Thêm mới Reader với Transaction
const createReader = async(readerData) => {
    const transaction = await sequelize.transaction();
    try {
        const reader = await Reader.create(readerData, { transaction });
        await transaction.commit();
        return reader;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Lấy tất cả Reader với tìm kiếm và sắp xếp
const getAllReaders = async(query) => {
    const { search, sortBy, order, page, limit } = query;
    const where = {};
    if (search) {
        where.reader_name = sequelize.where(
            sequelize.fn('LOWER', sequelize.col('reader_name')),
            'LIKE',
            `%${search.toLowerCase()}%`
        );
    }

    const offset = page && limit ? (page - 1) * limit : 0;
    const readers = await Reader.findAndCountAll({
        where,
        order: sortBy ? [
            [sortBy, order === 'desc' ? 'DESC' : 'ASC']
        ] : [
            ['reader_name', 'ASC']
        ],
        include: [LibraryCard],
        limit: limit ? parseInt(limit) : undefined,
        offset: offset || undefined,
    });
    return readers;
};

// Lấy Reader theo ID
const getReaderById = async(id) => {
    const reader = await Reader.findByPk(id, { include: [LibraryCard] });
    if (!reader) {
        throw createHttpError(404, 'Reader not found');
    }
    return reader;
};

// Cập nhật Reader với Transaction
const updateReader = async(id, updateData) => {
    const transaction = await sequelize.transaction();
    try {
        const reader = await getReaderById(id);
        Object.assign(reader, updateData);
        await reader.save({ transaction });
        await transaction.commit();
        return reader;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Xóa Reader với Trigger để xử lý dữ liệu liên quan
const deleteReader = async(id) => {
    const transaction = await sequelize.transaction();
    try {
        const reader = await getReaderById(id);
        await reader.destroy({ transaction });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Thống kê số lượng độc giả theo thẻ thư viện
const getReadersCountByLibraryCard = async() => {
    const result = await LibraryCard.findAll({
        attributes: [
            'card_number', [sequelize.fn('COUNT', sequelize.col('Readers.reader_id')), 'readers_count'],
        ],
        include: [{
            model: Reader,
            attributes: [],
        }],
        group: ['LibraryCard.card_number'],
    });
    return result;
};

// Function: Tìm kiếm độc giả theo địa chỉ
const searchReadersByAddress = async(address) => {
    const readers = await Reader.findAll({
        where: {
            address: {
                [sequelize.Op.like]: `%${address}%`,
            },
        },
        include: [LibraryCard],
    });
    return readers;
};

// Function: Thống kê độc giả theo khu vực
const getReadersByRegion = async() => {
    const result = await Reader.findAll({
        attributes: [
            'address', [sequelize.fn('COUNT', sequelize.col('reader_id')), 'readers_count'],
        ],
        group: ['address'],
        order: [
            [sequelize.fn('COUNT', sequelize.col('reader_id')), 'DESC']
        ],
    });
    return result;
};

export {
    createReader,
    getAllReaders,
    getReaderById,
    updateReader,
    deleteReader,
    getReadersCountByLibraryCard,
    searchReadersByAddress,
    getReadersByRegion,
};