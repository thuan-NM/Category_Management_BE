import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js'; // Đảm bảo thêm .js nếu bạn sử dụng ES6

const Borrowing = sequelize.define('Borrowing', {
    borrow_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    borrow_date: {
        type: DataTypes.DATE,
        allowNull: false,
    }
});

export default Borrowing; // Xuất Borrowing như một mặc định