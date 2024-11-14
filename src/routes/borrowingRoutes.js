import express from "express";
import {
  createBorrowing,
  getAllBorrowings,
  getBorrowingById,
  updateBorrowing,
  deleteBorrowing,
  getMonthlyBorrowings,
  checkBookAvailability,
  returnAllBooks,
  returnSingleBook,
  updateStatus,
  getBorrowingStatistics,
  getTopBorrowedBooks,
} from "../controllers/borrowingController.js";

import { controller } from "../middlewares/index.js";
import auth from "../middlewares/auth.js";

const router = express.Router();
router.use(auth); // Apply auth middleware to all routes below this line

router.post("/", controller(createBorrowing));
router.get("/", controller(getAllBorrowings));
router.get('/statistics', controller(getBorrowingStatistics));
router.get('/top-borrowed-books', controller(getTopBorrowedBooks));
router.get("/monthly-statistics", controller(getMonthlyBorrowings));
router.get("/check-availability/:book_id", controller(checkBookAvailability));
router.get("/:id", controller(getBorrowingById));
router.put("/:id", controller(updateBorrowing));
router.delete("/:id", controller(deleteBorrowing));
router.put("/:id/return", controller(returnAllBooks));
router.put("/details/:id/return", controller(returnSingleBook));
router.put("/:borrowId/status", controller(updateStatus));

export default router;
