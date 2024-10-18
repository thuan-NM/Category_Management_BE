import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js'; // Đảm bảo thêm .js nếu bạn sử dụng ES6

const Book = sequelize.define('Book', {
    book_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    publication_year: {
        type: DataTypes.INTEGER,
    }
});

export default Book; // Xuất Book như một mặc định