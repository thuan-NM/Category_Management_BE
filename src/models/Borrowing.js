import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Borrowing = sequelize.define('Borrowing', {
    borrow_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    card_number: {
        type: DataTypes.STRING,
        references: {
            model: 'library_cards',
            key: 'card_number',
        },
    },
    employee_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'employees',
            key: 'employee_id',
        },
    },
    borrow_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
}, {
    tableName: 'borrowings',
    timestamps: false,
});

export default Borrowing;