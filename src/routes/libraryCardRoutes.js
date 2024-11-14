import express from 'express';
import {
    createLibraryCard,
    getAllLibraryCards,
    getLibraryCardByNumber,
    updateLibraryCard,
    deleteLibraryCard,
    createLibraryCardWithExpiry,
    unlockLibraryCard
} from '../controllers/libraryCardController.js';
import { controller } from '../middlewares/index.js';
import auth from '../middlewares/auth.js';

const router = express.Router();
router.use(auth); // Apply auth middleware to all routes below this line

router.post('/', controller(createLibraryCard));
router.post('/with-expiry', controller(createLibraryCardWithExpiry));
router.get('/', controller(getAllLibraryCards));
router.get('/:card_number', controller(getLibraryCardByNumber));
router.put('/:card_number', controller(updateLibraryCard));
router.delete('/:card_number', controller(deleteLibraryCard));
router.put('/:card_number/unlock', controller(unlockLibraryCard));

export default router;