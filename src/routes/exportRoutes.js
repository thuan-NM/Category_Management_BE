// src/routes/ExportRoutes.js

import express from 'express';
import { exportCSV } from '../controllers/exportController.js';
import auth from '../middlewares/auth.js';
import { controller } from '../middlewares/index.js';

const router = express.Router();
router.use(auth) // Endpoint xuất CSV chung

router.get('/csv/:collection', controller(exportCSV));

export default router;