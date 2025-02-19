import { DataTypes } from "sequelize";
import sequelize from "../../db.js";
import User from "./User.js";

const Scan = sequelize.define("Scan", {
  scanId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  activity_name: { type: DataTypes.STRING, allowNull: false },
  activity_category: { type: DataTypes.STRING, allowNull: false },
  scanned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
}, { 
  tableName: "Scans",
});

// Associate Scans with Users
User.hasMany(Scan, { foreignKey: { name: "userId", allowNull: false }, onDelete: "CASCADE" });
Scan.belongsTo(User, { foreignKey: { name: "userId", allowNull: false } });

export default Scan;