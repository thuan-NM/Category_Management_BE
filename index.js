import express from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './src/models/index.js';
import router from './src/routes/index.js';
import cors from 'cors'; // Import cors

const app = express();

// Sử dụng CORS để cho phép yêu cầu từ các miền khác
app.use(cors({
    origin: '*', // Cho phép tất cả các miền. Có thể chỉ định miền cụ thể như 'http://example.com'
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức cho phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Các headers cho phép
}));

// Sử dụng body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Kết nối cơ sở dữ liệu và đồng bộ
sequelize.authenticate()
    .then(() => {
        console.log('Database connected...');
        return sequelize.sync();
    })
    .then(() => {
        console.log('Database synchronized');
    })
    .catch((err) => {
        console.error('Database connection failed:', err);
    });

// Sử dụng router
app.use('/api', router);

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});