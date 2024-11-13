import express from 'express';
import borrowingRoutes from './borrowingRoutes.js';
import employeeRoutes from './employeesRoutes.js';
import genreRoutes from './genreRoutes.js';
import libraryCardRoutes from './libraryCardRoutes.js';
import publisherRoutes from './publisherRoutes.js';
import borrowingDetailsRoutes from './borrowingDetailsRoutes.js';
import authorRoutes from './authorRoutes.js';
import bookRoutes from './bookRoutes.js';
import exportRoutes from './exportRoutes.js';

import { errorMiddleware, notFoundMiddleware, responseMiddleware } from "../middlewares/index.js";

const router = express.Router();

// Sử dụng middleware để chuẩn hóa phản hồi
router.use(responseMiddleware);

// Định tuyến cho các bảng khác nhau
router.use('/borrowings', borrowingRoutes);
router.use('/employees', employeeRoutes);
router.use('/genres', genreRoutes);
router.use('/librarycards', libraryCardRoutes);
router.use('/publishers', publisherRoutes);
router.use('/borrowingdetails', borrowingDetailsRoutes);
router.use('/authors', authorRoutes); // Định tuyến cho tác giả (authors)
router.use('/books', bookRoutes); // Định tuyến cho sách (books)
router.use('/export', exportRoutes);


// Middleware xử lý khi không tìm thấy route nào phù hợp
router.use(notFoundMiddleware);

// Middleware xử lý lỗi chung
router.use(errorMiddleware);

export default router;