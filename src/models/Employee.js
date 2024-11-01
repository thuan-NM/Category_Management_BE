import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Employee = sequelize.define('Employee', {
    employee_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
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
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'employees',
    timestamps: false,
});

export default Employee;