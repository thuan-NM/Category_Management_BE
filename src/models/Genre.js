import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Genre = sequelize.define('Genre', {
    genre_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    genre_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'genres',
    timestamps: false,
});

export default Genre;