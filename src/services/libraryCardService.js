// src/services/libraryCardService.js

import LibraryCard from '../models/LibraryCard.js';
import sequelize from '../config/db.config.js';
import createHttpError from 'http-errors';
import { Op } from 'sequelize';

// Thêm mới LibraryCard với Transaction
const createLibraryCard = async(cardData) => {
    const transaction = await sequelize.transaction();
    try {
        // Tạo LibraryCard với card_number được sinh ra tự động
        const card = await LibraryCard.create(cardData, { transaction });
        await transaction.commit();
        return card;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Lấy tất cả LibraryCard với tìm kiếm và sắp xếp
const getAllLibraryCards = async(query) => {
    const { search, sortBy, order, page, limit } = query;
    const where = {};

    if (search) {
        where[Op.or] = [
            { card_number: { [Op.like]: `%${search}%` } },
            { reader_name: { [Op.like]: `%${search}%` } }
        ];
    }

    const offset = page && limit ? (page - 1) * limit : 0;
    const cards = await LibraryCard.findAndCountAll({
        where,
        order: sortBy ? [
            [sortBy, order === 'desc' ? 'DESC' : 'ASC']
        ] : [
            ['start_date', 'DESC']
        ],
        limit: limit ? parseInt(limit) : undefined,
        offset: offset || undefined,
    });
    return cards;
};

// Lấy LibraryCard theo card_number
const getLibraryCardByNumber = async(card_number) => {
    const card = await LibraryCard.findByPk(card_number);
    if (!card) {
        throw createHttpError(404, 'Library Card not found');
    }
    return card;
};

// Cập nhật LibraryCard với Transaction
const updateLibraryCard = async(card_number, updateData) => {
    const transaction = await sequelize.transaction();
    try {
        const card = await getLibraryCardByNumber(card_number);
        Object.assign(card, updateData);
        await card.save({ transaction });
        await transaction.commit();
        return card;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Xóa LibraryCard với Transaction
const deleteLibraryCard = async(card_number) => {
    const transaction = await sequelize.transaction();
    try {
        const card = await getLibraryCardByNumber(card_number);
        await card.destroy({ transaction });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Stored Procedure: Tạo thẻ thư viện tự động dựa trên ngày bắt đầu và thời hạn
const createLibraryCardWithExpiry = async(cardData, expiryDays) => {
    const transaction = await sequelize.transaction();
    try {
        const startDate = cardData.start_date;
        const expiry_date = new Date(startDate);
        expiry_date.setDate(expiry_date.getDate() + expiryDays);

        const card = await LibraryCard.create({
            ...cardData,
            expiry_date,
        }, { transaction });

        await transaction.commit();
        return card;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
const unlockLibraryCard = async (card_number) => {
    const transaction = await sequelize.transaction();
    try {
        const libraryCard = await LibraryCard.findByPk(card_number, {
            transaction,
        });

        if (!libraryCard) {
            throw createHttpError(404, 'Library card not found');
        }

        libraryCard.is_locked = false;
        await libraryCard.save({ transaction });
        await transaction.commit();
        return libraryCard;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export {
    createLibraryCard,
    getAllLibraryCards,
    getLibraryCardByNumber,
    updateLibraryCard,
    deleteLibraryCard,
    createLibraryCardWithExpiry,
    unlockLibraryCard,
};
