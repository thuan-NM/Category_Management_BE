import express from 'express';
import {
    createReader,
    getAllReaders,
    getReaderById,
    updateReader,
    deleteReader,
    getReadersCountByLibraryCard,
    searchReadersByAddress,
    getReadersByRegion
} from '../controllers/readerController.js';
import { controller } from '../middlewares/index.js';

const router = express.Router();

router.post('/', controller(createReader));
router.get('/', controller(getAllReaders));
router.get('/count-by-library-card', controller(getReadersCountByLibraryCard));
router.get('/search-by-address', controller(searchReadersByAddress));
router.get('/by-region', controller(getReadersByRegion));
router.get('/:id', controller(getReaderById));
router.put('/:id', controller(updateReader));
router.delete('/:id', controller(deleteReader));

export default router;