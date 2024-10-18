import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Employee = sequelize.define('Employee', {
    employee_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    full_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    birth_date: {
        type: DataTypes.DATE,
    },
    phone_number: {
        type: DataTypes.STRING,
    },
    parent_number: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Đảm bảo username là duy nhất
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

export default Employee;