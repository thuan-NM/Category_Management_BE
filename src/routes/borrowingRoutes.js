import express from 'express';
import {
    createBorrowing,
    getAllBorrowings,
    getBorrowingById,
    updateBorrowing,
    deleteBorrowing,
    getMonthlyBorrowings,
    checkBookAvailability
} from '../controllers/borrowingController.js';
import { controller } from '../middlewares/index.js';

const router = express.Router();

router.post('/', controller(createBorrowing));
router.get('/', controller(getAllBorrowings));
router.get('/monthly-statistics', controller(getMonthlyBorrowings));
router.get('/check-availability/:book_id', controller(checkBookAvailability));
router.get('/:id', controller(getBorrowingById));
router.put('/:id', controller(updateBorrowing));
router.delete('/:id', controller(deleteBorrowing));

export default router;