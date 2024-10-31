import express from 'express';
import {
    createPublisher,
    getAllPublishers,
    getPublisherById,
    updatePublisher,
    deletePublisher,
    getBooksCountByPublisher,
    getTotalBooksByPublisher
} from '../controllers/publisherController.js';
import { controller } from '../middlewares/index.js';

const router = express.Router();

router.post('/', controller(createPublisher));
router.get('/', controller(getAllPublishers));
router.get('/count-books', controller(getBooksCountByPublisher));
router.get('/:id/total-books', controller(getTotalBooksByPublisher));
router.get('/:id', controller(getPublisherById));
router.put('/:id', controller(updatePublisher));
router.delete('/:id', controller(deletePublisher));

export default router;