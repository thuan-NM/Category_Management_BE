import sequelize from '../config/db.config.js';
import Book from './Book.js';
import Author from './Author.js';
import Genre from './Genre.js';
import Publisher from './Publisher.js';
import Reader from './Reader.js';
import LibraryCard from './LibraryCard.js';
import Employee from './Employee.js';
import Borrowing from './Borrowing.js';
import BorrowingDetails from './BorrowingDetails.js';

// 1. Quan hệ giữa Books và Authors, Genres, Publishers
Book.belongsTo(Author, { foreignKey: 'author_id', onDelete: 'SET NULL' });
Book.belongsTo(Genre, { foreignKey: 'genre_id', onDelete: 'SET NULL' });
Book.belongsTo(Publisher, { foreignKey: 'publisher_id', onDelete: 'SET NULL' });

// 2. Quan hệ giữa Readers và LibraryCards
Reader.belongsTo(LibraryCard, { foreignKey: 'card_number' });

// 3. Quan hệ giữa Borrowing và LibraryCards, Employees
Borrowing.belongsTo(LibraryCard, { foreignKey: 'card_number', onDelete: 'CASCADE' });
Borrowing.belongsTo(Employee, { foreignKey: 'employee_id', onDelete: 'SET NULL' });

// 4. Quan hệ giữa Borrowing và Books qua BorrowingDetails
Borrowing.hasMany(BorrowingDetails, { foreignKey: 'borrow_id' });
BorrowingDetails.belongsTo(Borrowing, { foreignKey: 'borrow_id', onDelete: 'CASCADE' });
BorrowingDetails.belongsTo(Book, { foreignKey: 'book_id', onDelete: 'CASCADE' });

export {
    sequelize,
    Book,
    Author,
    Genre,
    Publisher,
    Reader,
    LibraryCard,
    Employee,
    Borrowing,
    BorrowingDetails,
};