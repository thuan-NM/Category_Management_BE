import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Book = sequelize.define('Book', {
    book_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    publication_year: {
        type: DataTypes.INTEGER,
    },
    author_id: {
        type: DataTypes.UUID, // Updated to match UUID type from Author
        allowNull: true,
        references: {
            model: 'authors',
            key: 'author_id',
        },
    },
    genre_id: {
        type: DataTypes.UUID, // Updated to UUID type for consistency
        allowNull: true,
        references: {
            model: 'genres',
            key: 'genre_id',
        },
    },
    publisher_id: {
        type: DataTypes.UUID, // Updated to UUID type for consistency
        allowNull: true,
        references: {
            model: 'publishers',
            key: 'publisher_id',
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    tableName: 'books',
    timestamps: false,
});

export default Book;