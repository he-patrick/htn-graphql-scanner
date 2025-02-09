import { DataTypes } from "sequelize";
import sequelize from "../../db.js";

const Mealtime = sequelize.define("Mealtimes", {
  mealType: { type: DataTypes.STRING, allowNull: false, unique: true },
  startTime: { type: DataTypes.DATE, allowNull: false },
  endTime: { type: DataTypes.DATE, allowNull: false }
}, {
    tableName: "Mealtimes",
});

export default Mealtime;