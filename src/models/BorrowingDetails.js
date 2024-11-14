import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";

const BorrowingDetails = sequelize.define(
    "BorrowingDetails", {
        borrow_detail_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        borrow_id: {
            type: DataTypes.UUID,
            references: { model: "borrowings", key: "borrow_id" },
            onDelete: "CASCADE",
        },
        book_id: {
            type: DataTypes.UUID,
            references: { model: "books", key: "book_id" },
            onDelete: "CASCADE",
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        return_date: { type: DataTypes.DATEONLY },
        notes: {
            type: DataTypes.TEXT,
            default: "Không có",
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "borrowed", // Giá trị mặc định là 'borrowed'
        },
    }, {
        tableName: "borrowing_details",
        timestamps: false,
    }
);

export default BorrowingDetails;