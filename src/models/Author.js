import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js'; // Đảm bảo thêm .js nếu bạn sử dụng ES6

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
    }
});

export default Author; // Xuất Author như một mặc định