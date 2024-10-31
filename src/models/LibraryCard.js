import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const LibraryCard = sequelize.define('LibraryCard', {
    card_number: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    expiry_date: {
        type: DataTypes.DATEONLY,
    },
    notes: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'library_cards',
    timestamps: false,
});

export default LibraryCard;