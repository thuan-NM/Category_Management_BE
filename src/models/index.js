import sequelize from '../config/db.config.js';
import Author from './Author.js';
import Book from './Book.js';
import Genre from './Genre.js';
import Publisher from './Publisher.js';
import Reader from './Reader.js';
import LibraryCard from './LibraryCard.js';
import Employee from './Employee.js';
import Borrowing from './Borrowing.js';
import BorrowingDetails from './BorrowingDetails.js';

// Định nghĩa quan hệ

// 1. Quan hệ giữa Book và Author, Genre, Publisher
Author.hasMany(Book, { foreignKey: 'author_id', onDelete: 'SET NULL' });
Book.belongsTo(Author, { foreignKey: 'author_id', onDelete: 'SET NULL' });

Genre.hasMany(Book, { foreignKey: 'genre_id', onDelete: 'SET NULL' });
Book.belongsTo(Genre, { foreignKey: 'genre_id', onDelete: 'SET NULL' });

Publisher.hasMany(Book, { foreignKey: 'publisher_id', onDelete: 'SET NULL' });
Book.belongsTo(Publisher, { foreignKey: 'publisher_id', onDelete: 'SET NULL' });

// 2. Quan hệ giữa Reader và LibraryCard
LibraryCard.hasMany(Reader, { foreignKey: 'card_number', onDelete: 'CASCADE' });
Reader.belongsTo(LibraryCard, { foreignKey: 'card_number', onDelete: 'CASCADE' });

// 3. Quan hệ giữa Borrowing và LibraryCard, Employee
LibraryCard.hasMany(Borrowing, { foreignKey: 'card_number', onDelete: 'CASCADE' });
Borrowing.belongsTo(LibraryCard, { foreignKey: 'card_number', onDelete: 'CASCADE' });

Employee.hasMany(Borrowing, { foreignKey: 'employee_id', onDelete: 'SET NULL' });
Borrowing.belongsTo(Employee, { foreignKey: 'employee_id', onDelete: 'SET NULL' });

// 4. Quan hệ giữa BorrowingDetails và Borrowing, Book
Borrowing.hasMany(BorrowingDetails, { foreignKey: 'borrow_id', onDelete: 'CASCADE' });
BorrowingDetails.belongsTo(Borrowing, { foreignKey: 'borrow_id', onDelete: 'CASCADE' });

Book.hasMany(BorrowingDetails, { foreignKey: 'book_id', onDelete: 'CASCADE' });
BorrowingDetails.belongsTo(Book, { foreignKey: 'book_id', onDelete: 'CASCADE' });

export {
    sequelize,
    Author,
    Book,
    Genre,
    Publisher,
    Reader,
    LibraryCard,
    Employee,
    Borrowing,
    BorrowingDetails,
};