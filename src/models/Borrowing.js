import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";

const Borrowing = sequelize.define(
  "Borrowing",
  {
    borrow_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    card_number: {
      type: DataTypes.STRING,
      references: { model: "library_cards", key: "card_number" },
    },
    employee_id: {
      type: DataTypes.UUID,
      references: { model: "employees", key: "employee_id" },
    },
    borrow_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    is_returned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "borrowings",
    timestamps: false,
  }
);

export default Borrowing;
