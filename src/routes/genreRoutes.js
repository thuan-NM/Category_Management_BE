import express from 'express';
import {
    createGenre,
    getAllGenres,
    getGenreById,
    updateGenre,
    deleteGenre
} from '../controllers/genreController.js';
import { controller } from '../middlewares/index.js';

const router = express.Router();

router.post('/', controller(createGenre));
router.get('/', controller(getAllGenres));
router.get('/:id', controller(getGenreById));
router.put('/:id', controller(updateGenre));
router.delete('/:id', controller(deleteGenre));

export default router;