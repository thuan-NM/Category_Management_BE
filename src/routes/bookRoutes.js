// routes/bookRoutes.js

import express from 'express';
import {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
} from '../controllers/bookController.js';

const router = express.Router();

// GET /books?title=...&genre=...&author=...&publisher=...&publicationYearFrom=...&publicationYearTo=...&inStock=...&sortBy=...&order=...&page=...&limit=...
router.post('/', createBook);
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;
