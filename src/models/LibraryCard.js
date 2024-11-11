// models/LibraryCard.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';
import { Op } from 'sequelize'; // Import Op for operators

const LibraryCard = sequelize.define('LibraryCard', {
    card_number: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
        validate: {
            is: /^CT\d{6}$/, // Ensures format CT followed by exactly 6 digits
        },
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    expiry_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    reader_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'library_cards',
    timestamps: false,
});

// Using beforeCreate hook without sequence table
LibraryCard.beforeValidate(async(libraryCard, options) => {
    const transaction = options.transaction || await sequelize.transaction();
    try {
        // Fetch the latest card_number with a lock to prevent race conditions
        const lastCard = await LibraryCard.findOne({
            order: [
                ['card_number', 'DESC']
            ],
            lock: transaction.LOCK.UPDATE,
            transaction,
        });

        let nextNumber = 1;

        if (lastCard && lastCard.card_number) {
            const lastNumber = parseInt(lastCard.card_number.replace('CT', ''), 10);
            nextNumber = lastNumber + 1;
        }

        const formattedNumber = String(nextNumber).padStart(6, '0');
        libraryCard.card_number = `CT${formattedNumber}`;

        if (!options.transaction) {
            await transaction.commit();
        }
    } catch (error) {
        if (!options.transaction) {
            await transaction.rollback();
        }
        throw new Error('Error generating card number with transaction');
    }
});

export default LibraryCard;