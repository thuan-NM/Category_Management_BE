import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js'; // Đảm bảo thêm .js nếu bạn sử dụng ES6

const BorrowingDetails = sequelize.define('BorrowingDetails', {
    notes: {
        type: DataTypes.TEXT,
    },
    returned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    return_date: {
        type: DataTypes.DATE,
    }
});

export default BorrowingDetails; // Xuất BorrowingDetails như một mặc định