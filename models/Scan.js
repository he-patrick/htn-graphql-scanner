import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import User from "./User.js";

const Scan = sequelize.define("Scan", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  activity_name: { type: DataTypes.STRING, allowNull: false },
  activity_category: { type: DataTypes.STRING, allowNull: false },
  scanned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// Associate Scans with Users
User.hasMany(Scan, { foreignKey: "userId", onDelete: "CASCADE" });
Scan.belongsTo(User, { foreignKey: "userId" });

export { Scan, User };
