import { DataTypes } from "sequelize";
import sequelize from "../../db.js";

const MealTime = sequelize.define("MealTime", {
  mealType: { type: DataTypes.STRING, allowNull: false, unique: true },
  startTime: { type: DataTypes.TIME, allowNull: false },
  endTime: { type: DataTypes.TIME, allowNull: false }
}, {
    tableName: "MealTimes",
});

export default MealTime;