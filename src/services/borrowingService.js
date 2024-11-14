import {
  Borrowing,
  BorrowingDetails,
  Book,
  LibraryCard,
  Employee,
} from "../models/index.js";
import sequelize from "../config/db.config.js";
import createHttpError from "http-errors";
import { Op } from 'sequelize';

const createBorrowing = async (borrowingData) => {
  const { card_number, employee_id, borrow_date, books } = borrowingData;
  const transaction = await sequelize.transaction();

  try {
    const borrowing = await Borrowing.create(
      { card_number, employee_id, borrow_date },
      { transaction }
    );

    // Kiểm tra từng sách trong `books`
    for (const { book_id, quantity } of books) {
      const book = await Book.findByPk(book_id, { transaction });
      if (!book)
        throw createHttpError(404, `Book with id ${book_id} not found`);

      if (book.quantity < quantity) {
        throw createHttpError(
          400,
          `Not enough quantity for book with id ${book_id}`
        );
      }

      // Cập nhật quantity trong `Book`
      book.quantity -= quantity;
      await book.save({ transaction });
    }

    // Thêm `BorrowingDetails` với số lượng cho mỗi sách
    const borrowingDetailsData = books.map(({ book_id, quantity }) => ({
      borrow_id: borrowing.borrow_id,
      book_id,
      quantity,
    }));
    await BorrowingDetails.bulkCreate(borrowingDetailsData, { transaction });

    // Cập nhật `max_books_allowed` của `LibraryCard`
    const libraryCard = await LibraryCard.findByPk(card_number, {
      transaction,
    });
    libraryCard.max_books_allowed -= books.reduce(
      (sum, { quantity }) => sum + quantity,
      0
    );
    await libraryCard.save({ transaction });

    await transaction.commit();
    return borrowing;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const returnAllBooks = async (borrowId, retryCount = 0) => {
  let transaction; // Declare the transaction outside try-catch block

  try {
    // Create a new transaction for each attempt
    transaction = await sequelize.transaction();

    const borrowing = await Borrowing.findByPk(borrowId, {
      include: [BorrowingDetails],
      transaction,
    });

    if (!borrowing) {
      throw createHttpError(404, "Borrowing not found");
    }

    const libraryCard = await LibraryCard.findByPk(borrowing.card_number, {
      transaction,
    });

    const updatePromises = borrowing.BorrowingDetails.map(async (detail) => {
      const book = await Book.findByPk(detail.book_id, { transaction });
      if (detail.status === "borrowed" && !detail.return_date) {
        book.quantity += detail.quantity;
        detail.return_date = new Date();
        detail.status = "returned";
        libraryCard.max_books_allowed += detail.quantity;
      }
      await detail.save({ transaction });
      await book.save({ transaction });
    });

    await Promise.all(updatePromises);

    borrowing.is_returned = true;
    await borrowing.save({ transaction });
    await libraryCard.save({ transaction });

    await transaction.commit();
    return borrowing;
  } catch (error) {
    // Ensure the transaction is rolled back if an error occurs
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    // If it's a deadlock error, retry with a new transaction
    if (error.parent?.code === "ER_LOCK_DEADLOCK" && retryCount < MAX_RETRY) {
      console.log(`Deadlock detected. Retrying... Attempt ${retryCount + 1}`);
      // Return a new transaction for each retry attempt
      return await new Promise((resolve) =>
        setTimeout(() => resolve(returnAllBooks(borrowId, retryCount + 1)), 100)
      );
    } else {
      console.log({ error });
      throw error; // Rethrow error if it's not a deadlock
    }
  }
};

// Cập nhật lại hàm returnSingleBook
const returnSingleBook = async (borrowDetailId) => {
  const transaction = await sequelize.transaction();
  try {
    const borrowingDetail = await BorrowingDetails.findByPk(borrowDetailId, {
      transaction,
    });

    if (!borrowingDetail || borrowingDetail.return_date) {
      throw createHttpError(404, "Book not found or already returned");
    }

    const book = await Book.findByPk(borrowingDetail.book_id, { transaction });
    book.quantity += borrowingDetail.quantity;
    borrowingDetail.return_date = new Date(); // Đánh dấu đã trả sách
    borrowingDetail.status == "returned";
    await borrowingDetail.save({ transaction });
    await book.save({ transaction });

    // Cập nhật lại số lượng tối đa của thẻ
    const borrowing = await Borrowing.findByPk(borrowingDetail.borrow_id, {
      transaction,
    });
    const libraryCard = await LibraryCard.findByPk(borrowing.card_number, {
      transaction,
    });
    libraryCard.max_books_allowed += borrowingDetail.quantity;

    // Kiểm tra nếu tất cả sách trong bản ghi mượn đã được trả
    const allReturned = await BorrowingDetails.findAll({
      where: {
        borrow_id: borrowingDetail.borrow_id,
        return_date: null,
      },
      transaction,
    });

    if (allReturned.length === 0) {
      borrowing.is_returned = true;
      await borrowing.save({ transaction });
    }

    await libraryCard.save({ transaction });
    await transaction.commit();
    return borrowingDetail;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateBorrowing = async (id, updateData) => {
  const transaction = await sequelize.transaction();
  try {
    const borrowing = await getBorrowingById(id);
    Object.assign(borrowing, updateData);
    await borrowing.save({ transaction });

    if (updateData.books) {
      // Xóa các BorrowingDetails hiện tại và cập nhật quantity
      const currentDetails = await BorrowingDetails.findAll({
        where: { borrow_id: id },
        transaction,
      });
      for (const detail of currentDetails) {
        const book = await Book.findByPk(detail.book_id, { transaction });
        book.quantity += detail.quantity; // Trả lại quantity cũ
        await book.save({ transaction });
      }
      await BorrowingDetails.destroy({ where: { borrow_id: id }, transaction });

      // Tạo BorrowingDetails mới với số lượng cập nhật
      const borrowingDetailsData = updateData.books.map(
        ({ book_id, quantity }) => ({
          borrow_id: borrowing.borrow_id,
          book_id,
          quantity,
        })
      );
      for (const { book_id, quantity } of updateData.books) {
        const book = await Book.findByPk(book_id, { transaction });
        if (book.quantity < quantity)
          throw createHttpError(400, `Not enough quantity for book ${book_id}`);
        book.quantity -= quantity;
        await book.save({ transaction });
      }
      await BorrowingDetails.bulkCreate(borrowingDetailsData, { transaction });
    }

    await transaction.commit();
    return borrowing;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Lấy tất cả Borrowing với tìm kiếm và sắp xếp
const getAllBorrowings = async (query) => {
  const { search, sortBy, order, page, limit } = query;
  const where = {};
  if (search) {
    where.$or = [
      {
        borrow_id: {
          [sequelize.Op.like]: `%${search}%`,
        },
      },
      {
        "$LibraryCard.card_number$": {
          [sequelize.Op.like]: `%${search}%`,
        },
      },
      {
        "$Employee.full_name$": {
          [sequelize.Op.like]: `%${search}%`,
        },
      },
    ];
  }

  const offset = page && limit ? (page - 1) * limit : 0;
  const borrowings = await Borrowing.findAndCountAll({
    where,
    order: sortBy
      ? [[sortBy, order === "desc" ? "DESC" : "ASC"]]
      : [["borrow_date", "DESC"]],
    include: [
      { model: LibraryCard },
      { model: Employee },
      {
        model: BorrowingDetails,
        include: [Book],
      },
    ],
    limit: limit ? parseInt(limit) : undefined,
    offset: offset || undefined,
  });
  return borrowings;
};

// Lấy Borrowing theo ID
const getBorrowingById = async (id) => {
  const borrowing = await Borrowing.findByPk(id, {
    include: [
      { model: LibraryCard },
      { model: Employee },
      {
        model: BorrowingDetails,
        include: [Book],
      },
    ],
  });
  if (!borrowing) {
    throw createHttpError(404, "Borrowing not found");
  }
  return borrowing;
};

// Xóa Borrowing với Transaction
const deleteBorrowing = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    const borrowing = await getBorrowingById(id);
    await borrowing.destroy({ transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Thống kê số lượng mượn sách theo tháng
const getMonthlyBorrowings = async () => {
  const result = await Borrowing.findAll({
    attributes: [
      [sequelize.fn("YEAR", sequelize.col("borrow_date")), "year"],
      [sequelize.fn("MONTH", sequelize.col("borrow_date")), "month"],
      [sequelize.fn("COUNT", sequelize.col("borrow_id")), "borrow_count"],
    ],
    group: ["year", "month"],
    order: [
      ["year", "ASC"],
      ["month", "ASC"],
    ],
  });
  return result;
};

// Function: Kiểm tra số lượng sách còn lại
const checkBookAvailability = async (book_id) => {
  // Giả sử có trường 'quantity' trong bảng Books để lưu số lượng sách hiện có
  const book = await Book.findByPk(book_id);
  if (!book) {
    throw createHttpError(404, "Book not found");
  }
  return book.quantity;
};

const updateStatus = async (borrowId, isReturned) => {
  const transaction = await sequelize.transaction();
  try {
    const borrowing = await Borrowing.findByPk(borrowId, { transaction });
    if (!borrowing) throw new Error("Borrowing not found");

    borrowing.is_returned = isReturned;
    await borrowing.save({ transaction });
    await transaction.commit();
    return borrowing;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Hàm lấy thống kê mượn sách theo khoảng thời gian
const getBorrowingStatsByTimeInterval = async (interval) => {
  let dateFormat;
  switch (interval) {
    case 'month':
      dateFormat = '%Y-%m';
      break;
    case 'year':
      dateFormat = '%Y';
      break;
    default:
      throw createHttpError(400, 'Khoảng thời gian không hợp lệ');
  }

  const stats = await Borrowing.findAll({
    attributes: [
      [sequelize.literal(`DATE_FORMAT(borrow_date, '${dateFormat}')`), 'time'],
      [sequelize.fn('COUNT', sequelize.col('borrow_id')), 'borrow_count'],
    ],
    group: ['time'],
    order: [['time', 'ASC']],
    raw: true,
  });

  return stats;
};

// Hàm lấy danh sách sách được mượn nhiều nhất
const getTopBorrowedBooks = async (limit = 10) => {
  const stats = await BorrowingDetails.findAll({
    attributes: [
      'book_id',
      [sequelize.fn('SUM', sequelize.col('BorrowingDetails.quantity')), 'total_borrowed'],
    ],
    group: ['BorrowingDetails.book_id'],
    order: [[sequelize.literal('total_borrowed'), 'DESC']],
    include: [
      {
        model: Book,
        attributes: ['title'],
      },
    ],
    limit,
    raw: true,
    nest: true,
  });

  return stats;
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
  getBorrowingStatsByTimeInterval,
  getTopBorrowedBooks,
};
