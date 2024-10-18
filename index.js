import express from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './src/models/index.js'; // Cập nhật đường dẫn import nếu cần
import router from './src/routes/index.js';

const app = express();

// Sử dụng body-parser để parse JSON và urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Kết nối cơ sở dữ liệu và đồng bộ
sequelize.sync({ force: true })
    .then(() => {
        console.log('Database synced');
    })
    .catch((err) => {
        console.error('Unable to sync the database:', err);
    });

app.use(router);

// Khởi động server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});