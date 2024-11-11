import express from 'express';
import {
    createBorrowingDetails,
    getAllBorrowingDetails,
    getBorrowingDetailsById,
    updateBorrowingDetails,
    deleteBorrowingDetails,
    getUnreturnedBooksCount
} from '../controllers/borrowingDetailsController.js';
import { controller } from '../middlewares/index.js';
import auth from '../middlewares/auth.js';

const router = express.Router();
router.use(auth); // Apply auth middleware to all routes below this line

router.post('/', controller(createBorrowingDetails));
router.get('/', controller(getAllBorrowingDetails));
router.get('/unreturned-count', controller(getUnreturnedBooksCount));
router.get('/:id', controller(getBorrowingDetailsById));
router.put('/:id', controller(updateBorrowingDetails));
router.delete('/:id', controller(deleteBorrowingDetails));

export default router;