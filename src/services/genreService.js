import { Book, Genre } from '../models/index.js';
import createHttpError from 'http-errors';
import sequelize from '../config/db.config.js';
import { Op } from 'sequelize';

// Thêm mới Genre
const createGenre = async(genreData) => {
    return await Genre.create(genreData);
};

// Lấy tất cả Genre với tìm kiếm và sắp xếp
const getAllGenres = async (query) => {
    const { genre_name, description, sortBy, order, page = 1, limit = 10 } = query;

    const where = {};

    // Filter by genre_name if provided
    if (genre_name) {
        where.genre_name = {
            [Op.like]: `%${genre_name}%`
        };
    }

    // Filter by description if provided
    if (description) {
        where.description = {
            [Op.like]: `%${description}%`
        };
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    try {
        // Fetch genres with filters, sorting, and pagination
        const genres = await Genre.findAndCountAll({
            where,
            order: sortBy ? [
                [sortBy, order === 'desc' ? 'DESC' : 'ASC']
            ] : [
                ['genre_name', 'ASC']  // Default order by genre_name
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        return genres;
    } catch (error) {
        console.error('Error fetching genres:', error);
        throw new Error('Unable to fetch genres');
    }
};

// Lấy Genre theo ID
const getGenreById = async(id) => {
    const genre = await Genre.findByPk(id, { include: [Book] });
    if (!genre) {
        throw createHttpError(404, 'Genre not found');
    }
    return genre;
};

// Cập nhật Genre với Transaction
const updateGenre = async(id, updateData) => {
    const transaction = await sequelize.transaction();
    try {
        const genre = await getGenreById(id);
        Object.assign(genre, updateData);
        await genre.save({ transaction });
        await transaction.commit();
        return genre;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Xóa Genre với Trigger để xử lý dữ liệu liên quan
const deleteGenre = async(id) => {
    const transaction = await sequelize.transaction();
    try {
        const genre = await getGenreById(id);
        await genre.destroy({ transaction });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Thống kê số lượng sách theo thể loại (đã được tích hợp trong Book Service)
const getBooksCountByGenre = async() => {
    // Thực hiện trong Book Service
};

export {
    createGenre,
    getAllGenres,
    getGenreById,
    updateGenre,
    deleteGenre,
};