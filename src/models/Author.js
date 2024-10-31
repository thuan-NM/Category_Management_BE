import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Author = sequelize.define('Author', {
    author_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    author_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    website: {
        type: DataTypes.STRING,
    },
    notes: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'authors',
    timestamps: false,
});

export default Author;