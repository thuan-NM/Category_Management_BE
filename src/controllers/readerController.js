import {
    createReader as createReaderService,
    getAllReaders as getAllReadersService,
    getReaderById as getReaderByIdService,
    updateReader as updateReaderService,
    deleteReader as deleteReaderService,
    getReadersCountByLibraryCard as getReadersCountByLibraryCardService,
    searchReadersByAddress as searchReadersByAddressService,
    getReadersByRegion as getReadersByRegionService
} from '../services/readerService.js';

// Thêm mới Reader
const createReader = async(req, res) => {
    const reader = await createReaderService(req.body);
    res.fly({
        status: 201,
        data: reader,
        code: 'reader_s_01',
        message: 'Create new reader successfully'
    });
};

// Lấy tất cả Readers
const getAllReaders = async(req, res) => {
    const readers = await getAllReadersService(req.query);
    res.fly({
        status: 200,
        data: readers,
        code: 'reader_s_02',
        message: 'Get all readers successfully'
    });
};

// Lấy Reader theo ID
const getReaderById = async(req, res) => {
    const reader = await getReaderByIdService(req.params.id);
    res.fly({
        status: 200,
        data: reader,
        code: 'reader_s_03',
        message: 'Get reader successfully'
    });
};

// Cập nhật Reader
const updateReader = async(req, res) => {
    const reader = await updateReaderService(req.params.id, req.body);
    res.fly({
        status: 200,
        data: reader,
        code: 'reader_s_04',
        message: 'Update reader successfully'
    });
};

// Xóa Reader
const deleteReader = async(req, res) => {
    await deleteReaderService(req.params.id);
    res.fly({
        status: 204,
        code: 'reader_s_05',
        message: 'Delete reader successfully'
    });
};

// Thống kê số lượng độc giả theo thẻ thư viện
const getReadersCountByLibraryCard = async(req, res) => {
    const result = await getReadersCountByLibraryCardService();
    res.fly({
        status: 200,
        data: result,
        code: 'reader_s_06',
        message: 'Get readers count by library card successfully'
    });
};

// Tìm kiếm độc giả theo địa chỉ
const searchReadersByAddress = async(req, res) => {
    const readers = await searchReadersByAddressService(req.query.address);
    res.fly({
        status: 200,
        data: readers,
        code: 'reader_s_07',
        message: 'Search readers by address successfully'
    });
};

// Thống kê độc giả theo khu vực
const getReadersByRegion = async(req, res) => {
    const result = await getReadersByRegionService();
    res.fly({
        status: 200,
        data: result,
        code: 'reader_s_08',
        message: 'Get readers by region successfully'
    });
};

export {
    createReader,
    getAllReaders,
    getReaderById,
    updateReader,
    deleteReader,
    getReadersCountByLibraryCard,
    searchReadersByAddress,
    getReadersByRegion
};