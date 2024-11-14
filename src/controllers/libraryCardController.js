import {
    createLibraryCard as createLibraryCardService,
    getAllLibraryCards as getAllLibraryCardsService,
    getLibraryCardByNumber as getLibraryCardByNumberService,
    updateLibraryCard as updateLibraryCardService,
    deleteLibraryCard as deleteLibraryCardService,
    createLibraryCardWithExpiry as createLibraryCardWithExpiryService,
    unlockLibraryCard as unlockLibraryCardService
} from '../services/libraryCardService.js';

// Thêm mới LibraryCard
const createLibraryCard = async (req, res, next) => {
    try {
        const { card_number, ...cardData } = req.body;
        const card = await createLibraryCardService(cardData);
        res.status(201).json({
            message: 'Create new library card successfully',
            data: card
        });
    } catch (error) {
        next(error);
    }
};

// Lấy tất cả LibraryCards
const getAllLibraryCards = async (req, res, next) => {
    try {
        const cards = await getAllLibraryCardsService(req.query);
        res.status(200).json({
            message: 'Get all library cards successfully',
            data: cards
        });
    } catch (error) {
        next(error);
    }
};

// Lấy LibraryCard theo số thẻ
const getLibraryCardByNumber = async (req, res, next) => {
    try {
        const card = await getLibraryCardByNumberService(req.params.card_number);
        res.status(200).json({
            message: 'Get library card successfully',
            data: card
        });
    } catch (error) {
        next(error);
    }
};

// Cập nhật LibraryCard
const updateLibraryCard = async (req, res, next) => {
    try {
        const card = await updateLibraryCardService(req.params.card_number, req.body);
        res.status(200).json({
            message: 'Update library card successfully',
            data: card
        });
    } catch (error) {
        next(error);
    }
};

// Xóa LibraryCard
const deleteLibraryCard = async (req, res, next) => {
    try {
        await deleteLibraryCardService(req.params.card_number);
        res.status(204).json({
            message: 'Delete library card successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Tạo thẻ thư viện với ngày hết hạn tự động
const createLibraryCardWithExpiry = async (req, res, next) => {
    try {
        const card = await createLibraryCardWithExpiryService(req.body, req.body.expiryDays);
        res.status(201).json({
            message: 'Create new library card with expiry date successfully',
            data: card
        });
    } catch (error) {
        next(error);
    }
};

const unlockLibraryCard = async (req, res, next) => {
    try {
        const { card_number } = req.params; // Get card number from request parameters
        const card = await unlockLibraryCard(card_number); // Call the service function

        res.status(200).json({
            message: 'Library card unlocked successfully',
            card, // Return the unlocked card details
        });
    } catch (error) {
        next(error); // Pass error to error-handling middleware
    }
};

export {
    createLibraryCard,
    getAllLibraryCards,
    getLibraryCardByNumber,
    updateLibraryCard,
    deleteLibraryCard,
    createLibraryCardWithExpiry,
    unlockLibraryCard
};