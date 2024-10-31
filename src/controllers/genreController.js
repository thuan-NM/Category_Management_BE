import {
    createGenre as createGenreService,
    getAllGenres as getAllGenresService,
    getGenreById as getGenreByIdService,
    updateGenre as updateGenreService,
    deleteGenre as deleteGenreService
} from '../services/genreService.js';

// Thêm mới Genre
const createGenre = async(req, res) => {
    const genre = await createGenreService(req.body);
    res.fly({
        status: 201,
        data: genre,
        code: 'genre_s_01',
        message: 'Create new genre successfully'
    });
};

// Lấy tất cả Genres
const getAllGenres = async(req, res) => {
    const genres = await getAllGenresService(req.query);
    res.fly({
        status: 200,
        data: genres,
        code: 'genre_s_02',
        message: 'Get all genres successfully'
    });
};

// Lấy Genre theo ID
const getGenreById = async(req, res) => {
    const genre = await getGenreByIdService(req.params.id);
    res.fly({
        status: 200,
        data: genre,
        code: 'genre_s_03',
        message: 'Get genre successfully'
    });
};

// Cập nhật Genre
const updateGenre = async(req, res) => {
    const genre = await updateGenreService(req.params.id, req.body);
    res.fly({
        status: 200,
        data: genre,
        code: 'genre_s_04',
        message: 'Update genre successfully'
    });
};

// Xóa Genre
const deleteGenre = async(req, res) => {
    await deleteGenreService(req.params.id);
    res.fly({
        status: 204,
        code: 'genre_s_05',
        message: 'Delete genre successfully'
    });
};

export {
    createGenre,
    getAllGenres,
    getGenreById,
    updateGenre,
    deleteGenre
};