import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js'; // Đảm bảo thêm .js nếu bạn sử dụng ES6

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
        unique: true,
    }
});

export default Reader; // Xuất Reader như một mặc định