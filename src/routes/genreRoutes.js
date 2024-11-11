import express from 'express';
import {
    createGenre,
    getAllGenres,
    getGenreById,
    updateGenre,
    deleteGenre
} from '../controllers/genreController.js';
import { controller } from '../middlewares/index.js';
import auth from '../middlewares/auth.js';

const router = express.Router();
router.use(auth); // Apply auth middleware to all routes below this line

router.post('/', controller(createGenre));
router.get('/', controller(getAllGenres));
router.get('/:id', controller(getGenreById));
router.put('/:id', controller(updateGenre));
router.delete('/:id', controller(deleteGenre));

export default router;