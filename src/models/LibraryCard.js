import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js'; // Đảm bảo thêm .js nếu bạn sử dụng ES6

const LibraryCard = sequelize.define('LibraryCard', {
    card_number: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    start_date: {
        type: DataTypes.DATE,
    },
    expiry_date: {
        type: DataTypes.DATE,
    },
    notes: {
        type: DataTypes.TEXT,
    }
});

export default LibraryCard; // Xuất LibraryCard như một mặc định