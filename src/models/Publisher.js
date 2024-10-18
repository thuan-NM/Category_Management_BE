import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js'; // Đảm bảo thêm .js nếu bạn sử dụng ES6

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
    }
});

export default Publisher; // Xuất Publisher như một mặc định