import sequelize from '../config/db.config.js';
import Author from './Author.js';
import Book from './Book.js';
import Genre from './Genre.js';
import Publisher from './Publisher.js';
import LibraryCard from './LibraryCard.js';
import Employee from './Employee.js';
import Borrowing from './Borrowing.js';
import BorrowingDetails from './BorrowingDetails.js';

// Define Relationships
Author.hasMany(Book, { foreignKey: 'author_id', onDelete: 'SET NULL' });
Book.belongsTo(Author, { foreignKey: 'author_id', onDelete: 'SET NULL' });

Genre.hasMany(Book, { foreignKey: 'genre_id', onDelete: 'SET NULL' });
Book.belongsTo(Genre, { foreignKey: 'genre_id', onDelete: 'SET NULL' });

Publisher.hasMany(Book, { foreignKey: 'publisher_id', onDelete: 'SET NULL' });
Book.belongsTo(Publisher, { foreignKey: 'publisher_id', onDelete: 'SET NULL' });

LibraryCard.hasMany(Borrowing, { foreignKey: 'card_number', onDelete: 'CASCADE' });
Borrowing.belongsTo(LibraryCard, { foreignKey: 'card_number', onDelete: 'CASCADE' });

Employee.hasMany(Borrowing, { foreignKey: 'employee_id', onDelete: 'SET NULL' });
Borrowing.belongsTo(Employee, { foreignKey: 'employee_id', onDelete: 'SET NULL' });

Borrowing.hasMany(BorrowingDetails, { foreignKey: 'borrow_id', onDelete: 'CASCADE' });
BorrowingDetails.belongsTo(Borrowing, { foreignKey: 'borrow_id', onDelete: 'CASCADE' });

Book.hasMany(BorrowingDetails, { foreignKey: 'book_id', onDelete: 'CASCADE' });
BorrowingDetails.belongsTo(Book, { foreignKey: 'book_id', onDelete: 'CASCADE' });

// Exporting Models and Fields Mapping
const fieldsMapping = {
    Employee: [
        'full_name',
        'birth_date',
        'phone_number',
        'parent_number',
        'username',
        'role'
    ],
    Genre: [
        'genre_name',
        'description'
    ],
    Publisher: [
        'publisher_name',
        'address',
        'email',
        'representative_info'
    ],
    Book: [
        'title',
        'publication_year',
        'Author.author_name',
        'Genre.genre_name',
        'Publisher.publisher_name',
        'quantity'
    ],
    LibraryCard: [
        'card_number',
        'start_date',
        'expiry_date',
        'reader_name',
        'address',
        'notes'
    ],
    Borrowing: [
        'LibraryCard.reader_name',
        'Employee.full_name',
        'borrow_date'
    ],
    BorrowingDetails: [
        'Borrowing.borrow_id',
        'Book.title',
        'return_date',
        'notes'
    ],
    Author: [
        'author_name',
        'website',
        'notes'
    ]
};

export {
    sequelize,
    Author,
    Book,
    Genre,
    Publisher,
    LibraryCard,
    Employee,
    Borrowing,
    BorrowingDetails,
    fieldsMapping
};