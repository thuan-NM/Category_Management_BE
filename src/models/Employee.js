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
        type: DataTypes.DATEONLY,
    },
    phone_number: {
        type: DataTypes.STRING,
    },
    parent_number: {
        type: DataTypes.STRING,
    },
    username: {
        type: DataTypes.STRING(50), // Giới hạn độ dài tối đa của username là 20 ký tự
        unique: true,
        allowNull: false,
        validate: {
            len: [4, 50], // Giới hạn độ dài username từ 4 đến 20 ký tự
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'employee'
    }
}, {
    tableName: 'employees',
    timestamps: false,
});

export default Employee;