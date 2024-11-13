import express from 'express';
import {
    createAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor,
    deleteAuthor,
    getAuthorStatistics
} from '../controllers/authorController.js';
import { controller } from '../middlewares/index.js';

const router = express.Router();

router.post('/', controller(createAuthor));
router.get('/', controller(getAllAuthors));
router.get('/statistics',controller(getAuthorStatistics));
router.get('/:id', controller(getAuthorById));
router.put('/:id', controller(updateAuthor));
router.delete('/:id', controller(deleteAuthor));


export default router;