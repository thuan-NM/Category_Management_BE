import {
    createAuthor as createAuthorService,
    getAllAuthors as getAllAuthorsService,
    getAuthorById as getAuthorByIdService,
    updateAuthor as updateAuthorService,
    deleteAuthor as deleteAuthorService,
    getAuthorStatistics as getAuthorStatisticsService
} from '../services/authorService.js';

// Thêm mới Author
const createAuthor = async(req, res) => {
    const author = await createAuthorService(req.body);
    res.fly({
        status: 201,
        data: author,
        code: 'author_s_01',
        message: 'Create new author successfully',
    });
};

// Lấy tất cả Author
const getAllAuthors = async(req, res) => {
    const authors = await getAllAuthorsService();
    res.fly({
        status: 200,
        data: authors,
        code: 'author_s_02',
        message: 'Get all authors successfully',
    });
};

// Lấy Author theo ID
const getAuthorById = async(req, res) => {
    const author = await getAuthorByIdService(req.params.id);
    res.fly({
        status: 200,
        data: author,
        code: 'author_s_03',
        message: 'Get author successfully',
    });
};

// Cập nhật Author
const updateAuthor = async(req, res) => {
    const author = await updateAuthorService(req.params.id, req.body);
    res.fly({
        status: 200,
        data: author,
        code: 'author_s_04',
        message: 'Update author successfully',
    });
};

// Xóa Author
const deleteAuthor = async(req, res) => {
    await deleteAuthorService(req.params.id);
    res.fly({
        status: 204,
        code: 'author_s_05',
        message: 'Delete author successfully',
    });
};
const getAuthorStatistics = async (req, res) => {
    try {
        const statistics = await getAuthorStatisticsService();
        
        // Sử dụng res.fly thay vì res.json
        res.fly({
            status: 200,
            code: 'author_s_01',
            message: 'Author statistics fetched successfully',
            data: statistics,
        });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Error fetching author statistics:', error);
        res.fly({
            status: 500,
            code: 'author_e_01',
            message: 'Error fetching author statistics',
        });
    }
};

export {
    createAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor,
    deleteAuthor,
    getAuthorStatistics
};