import {
  createBorrowing as createBorrowingService,
  getAllBorrowings as getAllBorrowingsService,
  getBorrowingById as getBorrowingByIdService,
  updateBorrowing as updateBorrowingService,
  deleteBorrowing as deleteBorrowingService,
  getMonthlyBorrowings as getMonthlyBorrowingsService,
  checkBookAvailability as checkBookAvailabilityService,
  returnAllBooks as returnAllBooksService,
  returnSingleBook as returnSingleBookService,
  updateStatus as updateStatusService,
  getBorrowingStatsByTimeInterval as getBorrowingStatsByTimeIntervalService,
  getTopBorrowedBooks as getTopBorrowedBooksService,
} from "../services/borrowingService.js";

// Thêm mới Borrowing
const createBorrowing = async (req, res) => {
  const borrowing = await createBorrowingService(req.body);
  res.fly({
    status: 201,
    data: borrowing,
    code: "borrowing_s_01",
    message: "Create new borrowing successfully",
  });
};

// Lấy tất cả Borrowing
const getAllBorrowings = async (req, res) => {
  const borrowings = await getAllBorrowingsService(req.query);
  res.fly({
    status: 200,
    data: borrowings,
    code: "borrowing_s_02",
    message: "Get all borrowings successfully",
  });
};

// Lấy Borrowing theo ID
const getBorrowingById = async (req, res) => {
  const borrowing = await getBorrowingByIdService(req.params.id);
  res.fly({
    status: 200,
    data: borrowing,
    code: "borrowing_s_03",
    message: "Get borrowing successfully",
  });
};

// Cập nhật Borrowing
const updateBorrowing = async (req, res) => {
  const borrowing = await updateBorrowingService(req.params.id, req.body);
  res.fly({
    status: 200,
    data: borrowing,
    code: "borrowing_s_04",
    message: "Update borrowing successfully",
  });
};

// Xóa Borrowing
const deleteBorrowing = async (req, res) => {
  await deleteBorrowingService(req.params.id);
  res.fly({
    status: 204,
    code: "borrowing_s_05",
    message: "Delete borrowing successfully",
  });
};

// Thống kê số lượng mượn sách theo tháng
const getMonthlyBorrowings = async (req, res) => {
  const result = await getMonthlyBorrowingsService();
  res.fly({
    status: 200,
    data: result,
    code: "borrowing_s_06",
    message: "Get monthly borrowings statistics successfully",
  });
};

// Kiểm tra số lượng sách còn lại
const checkBookAvailability = async (req, res) => {
  const availability = await checkBookAvailabilityService(req.params.book_id);
  res.fly({
    status: 200,
    data: availability,
    code: "borrowing_s_07",
    message: "Check book availability successfully",
  });
};

const returnAllBooks = async (req, res) => {
  const availability = await returnAllBooksService(req.params.id);
  res.fly({
    status: 200,
    data: availability,
    code: "borrowing_s_07",
    message: "Check book availability successfully",
  });
};

const returnSingleBook = async (req, res) => {
  const availability = await returnSingleBookService(req.params.id);
  res.fly({
    status: 200,
    data: availability,
    code: "borrowing_s_07",
    message: "Check book availability successfully",
  });
};

const updateStatus = async (req, res, next) => {
  const { borrowId } = req.params;
  const { isReturned } = req.body;

  const updatedBorrowing = await updateStatusService(borrowId, isReturned);

  res.fly({
    status: 200,
    data: updatedBorrowing,
    code: "borrowing_s_08",
    message: "Update borrwing status succesfully",
  });
};

const getBorrowingStatistics = async (req, res, next) => {
  try {
    const { interval } = req.query;
    const data = await getBorrowingStatsByTimeIntervalService(interval);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getTopBorrowedBooks = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const data = await getTopBorrowedBooksService(parseInt(limit) || 10);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export {
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
};
