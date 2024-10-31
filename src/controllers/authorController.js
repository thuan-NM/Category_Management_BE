import {
    createAuthor as createAuthorService,
    getAllAuthors as getAllAuthorsService,
    getAuthorById as getAuthorByIdService,
    updateAuthor as updateAuthorService,
    deleteAuthor as deleteAuthorService,
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

export {
    createAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor,
    deleteAuthor,
};