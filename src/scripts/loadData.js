import fs from "fs";
import User from "../models/User.js";
import Scan from "../models/Scan.js";
import sequelize from "../../db.js";

async function loadData() {
  await sequelize.sync({ alter: true });

  const rawData = fs.readFileSync("example_data.json");
  const users = JSON.parse(rawData);

  for (const userData of users) {
    const user = await User.create({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      badge_code: userData.badge_code || `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`
    });

    for (const scan of userData.scans) {
      await Scan.create({
        userId: user.userId,
        activity_name: scan.activity_name,
        activity_category: scan.activity_category,
        scanned_at: scan.scanned_at
      });
    }
  }

  console.log("Data successfully loaded!");
  await sequelize.close();
}

loadData().catch(console.error);
