import sequelize from "./db.js";
import User from "./src/models/User.js";
import Scan from "./src/models/Scan.js";
import Mealtime from "./src/models/Mealtime.js";
import Karaoke from "./src/models/Karaoke.js";
import dotenv from "dotenv";

dotenv.config();

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synchronized!");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  } finally {
    await sequelize.close();
  }
};

syncDatabase();