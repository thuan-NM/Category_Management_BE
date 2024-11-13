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
import auth from '../middlewares/auth.js';

const router = express.Router();
router.use(auth); // Apply auth middleware to all routes below this line

router.post('/', controller(createAuthor));
router.get('/', controller(getAllAuthors));
router.get('/statistics',controller(getAuthorStatistics));
router.get('/:id', controller(getAuthorById));
router.put('/:id', controller(updateAuthor));
router.delete('/:id', controller(deleteAuthor));


export default router;