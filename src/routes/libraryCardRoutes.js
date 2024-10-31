import express from 'express';
import {
    createLibraryCard,
    getAllLibraryCards,
    getLibraryCardByNumber,
    updateLibraryCard,
    deleteLibraryCard,
    getReadersCountByLibraryCard,
    createLibraryCardWithExpiry
} from '../controllers/libraryCardController.js';
import { controller } from '../middlewares/index.js';

const router = express.Router();

router.post('/', controller(createLibraryCard));
router.post('/with-expiry', controller(createLibraryCardWithExpiry));
router.get('/', controller(getAllLibraryCards));
router.get('/count-readers', controller(getReadersCountByLibraryCard));
router.get('/:card_number', controller(getLibraryCardByNumber));
router.put('/:card_number', controller(updateLibraryCard));
router.delete('/:card_number', controller(deleteLibraryCard));

export default router;