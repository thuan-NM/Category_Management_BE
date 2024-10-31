import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Reader = sequelize.define('Reader', {
    reader_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    reader_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
    },
    card_number: {
        type: DataTypes.STRING,
        references: {
            model: 'library_cards',
            key: 'card_number',
        },
    },
}, {
    tableName: 'readers',
    timestamps: false,
});

export default Reader;