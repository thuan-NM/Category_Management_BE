import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'; // Import dotenv

dotenv.config(); // Nạp biến môi trường từ file .env

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false, // Tắt logging query nếu không cần thiết
    }
);

export default sequelize; // Xuất sequelize như một mặc định