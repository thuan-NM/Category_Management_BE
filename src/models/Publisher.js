import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Publisher = sequelize.define('Publisher', {
    publisher_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    publisher_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    representative_info: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'publishers',
    timestamps: false,
});

export default Publisher;