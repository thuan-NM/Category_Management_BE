import {
    createLibraryCard as createLibraryCardService,
    getAllLibraryCards as getAllLibraryCardsService,
    getLibraryCardByNumber as getLibraryCardByNumberService,
    updateLibraryCard as updateLibraryCardService,
    deleteLibraryCard as deleteLibraryCardService,
    getReadersCountByLibraryCard as getReadersCountByLibraryCardService,
    createLibraryCardWithExpiry as createLibraryCardWithExpiryService
} from '../services/libraryCardService.js';

// Thêm mới LibraryCard
const createLibraryCard = async(req, res) => {
    const card = await createLibraryCardService(req.body);
    res.fly({
        status: 201,
        data: card,
        code: 'librarycard_s_01',
        message: 'Create new library card successfully'
    });
};

// Lấy tất cả LibraryCards
const getAllLibraryCards = async(req, res) => {
    const cards = await getAllLibraryCardsService(req.query);
    res.fly({
        status: 200,
        data: cards,
        code: 'librarycard_s_02',
        message: 'Get all library cards successfully'
    });
};

// Lấy LibraryCard theo số thẻ
const getLibraryCardByNumber = async(req, res) => {
    const card = await getLibraryCardByNumberService(req.params.card_number);
    res.fly({
        status: 200,
        data: card,
        code: 'librarycard_s_03',
        message: 'Get library card successfully'
    });
};

// Cập nhật LibraryCard
const updateLibraryCard = async(req, res) => {
    const card = await updateLibraryCardService(req.params.card_number, req.body);
    res.fly({
        status: 200,
        data: card,
        code: 'librarycard_s_04',
        message: 'Update library card successfully'
    });
};

// Xóa LibraryCard
const deleteLibraryCard = async(req, res) => {
    await deleteLibraryCardService(req.params.card_number);
    res.fly({
        status: 204,
        code: 'librarycard_s_05',
        message: 'Delete library card successfully'
    });
};

// Thống kê số lượng độc giả theo thẻ thư viện
const getReadersCountByLibraryCard = async(req, res) => {
    const result = await getReadersCountByLibraryCardService();
    res.fly({
        status: 200,
        data: result,
        code: 'librarycard_s_06',
        message: 'Get readers count by library card successfully'
    });
};

// Tạo thẻ thư viện với ngày hết hạn tự động
const createLibraryCardWithExpiry = async(req, res) => {
    const card = await createLibraryCardWithExpiryService(req.body, req.body.expiryDays);
    res.fly({
        status: 201,
        data: card,
        code: 'librarycard_s_07',
        message: 'Create new library card with expiry date successfully'
    });
};

export {
    createLibraryCard,
    getAllLibraryCards,
    getLibraryCardByNumber,
    updateLibraryCard,
    deleteLibraryCard,
    getReadersCountByLibraryCard,
    createLibraryCardWithExpiry
};