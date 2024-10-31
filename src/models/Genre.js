import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Genre = sequelize.define('Genre', {
    genre_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    genre_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'genres',
    timestamps: false,
});

export default Genre;