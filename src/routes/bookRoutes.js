import express from 'express';
import {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
} from '../controllers/bookController.js';
import { controller } from '../middlewares/index.js';

const router = express.Router();

router.post('/', controller(createBook));
router.get('/', controller(getAllBooks));
router.get('/:id', controller(getBookById));
router.put('/:id', controller(updateBook));
router.delete('/:id', controller(deleteBook));

export default router;