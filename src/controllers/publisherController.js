import {
    createPublisher as createPublisherService,
    getAllPublishers as getAllPublishersService,
    getPublisherById as getPublisherByIdService,
    updatePublisher as updatePublisherService,
    deletePublisher as deletePublisherService,
    getBooksCountByPublisher as getBooksCountByPublisherService,
    getTotalBooksByPublisher as getTotalBooksByPublisherService
} from '../services/publisherService.js';

// Thêm mới Publisher
const createPublisher = async(req, res) => {
    const publisher = await createPublisherService(req.body);
    res.fly({
        status: 201,
        data: publisher,
        code: 'publisher_s_01',
        message: 'Create new publisher successfully'
    });
};

// Lấy tất cả Publishers
const getAllPublishers = async(req, res) => {
    const publishers = await getAllPublishersService(req.query);
    res.fly({
        status: 200,
        data: publishers,
        code: 'publisher_s_02',
        message: 'Get all publishers successfully'
    });
};

// Lấy Publisher theo ID
const getPublisherById = async(req, res) => {
    const publisher = await getPublisherByIdService(req.params.id);
    res.fly({
        status: 200,
        data: publisher,
        code: 'publisher_s_03',
        message: 'Get publisher successfully'
    });
};

// Cập nhật Publisher
const updatePublisher = async(req, res) => {
    const publisher = await updatePublisherService(req.params.id, req.body);
    res.fly({
        status: 200,
        data: publisher,
        code: 'publisher_s_04',
        message: 'Update publisher successfully'
    });
};

// Xóa Publisher
const deletePublisher = async(req, res) => {
    await deletePublisherService(req.params.id);
    res.fly({
        status: 204,
        code: 'publisher_s_05',
        message: 'Delete publisher successfully'
    });
};

// Thống kê số lượng sách theo nhà xuất bản
const getBooksCountByPublisher = async(req, res) => {
    const result = await getBooksCountByPublisherService();
    res.fly({
        status: 200,
        data: result,
        code: 'publisher_s_06',
        message: 'Get books count by publisher successfully'
    });
};

// Tính tổng số sách của một nhà xuất bản
const getTotalBooksByPublisher = async(req, res) => {
    const result = await getTotalBooksByPublisherService(req.params.id);
    res.fly({
        status: 200,
        data: result,
        code: 'publisher_s_07',
        message: 'Get total books by publisher successfully'
    });
};

export {
    createPublisher,
    getAllPublishers,
    getPublisherById,
    updatePublisher,
    deletePublisher,
    getBooksCountByPublisher,
    getTotalBooksByPublisher
};