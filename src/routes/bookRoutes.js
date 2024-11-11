import express from 'express';
import {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
} from '../controllers/bookController.js';
import { controller } from '../middlewares/index.js';
import auth from '../middlewares/auth.js';

const router = express.Router();
router.use(auth); // Apply auth middleware to all routes below this line

router.post('/', controller(createBook));
router.get('/', controller(getAllBooks));
router.get('/:id', controller(getBookById));
router.put('/:id', controller(updateBook));
router.delete('/:id', controller(deleteBook));

export default router;