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
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
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