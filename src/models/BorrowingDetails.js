import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const BorrowingDetails = sequelize.define('BorrowingDetails', {
    borrow_detail_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    borrow_id: {
        type: DataTypes.UUID,
        references: {
            model: 'borrowings',
            key: 'borrow_id',
        },
        onDelete: 'CASCADE',
    },
    book_id: {
        type: DataTypes.UUID,
        references: {
            model: 'books',
            key: 'book_id',
        },
        onDelete: 'CASCADE',
    },
    return_date: {
        type: DataTypes.DATEONLY,
    },
    notes: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'borrowing_details',
    timestamps: false,
});

export default BorrowingDetails;