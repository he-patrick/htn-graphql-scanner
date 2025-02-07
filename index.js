import express from "express";
import { graphqlHTTP } from "express-graphql";
import sequelize from "./db.js";
import schema from "./graphql/schema.js";
import Scan from "./models/Scan.js";
import User from "./models/User.js";

const port = process.env.PORT || 3000;
const app = express();

sequelize.sync({ alter: true, force: true }).then(() => {
  console.log("Database synced successfully");
});

app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));

app.get("/users", async (req, res) => {
  try {
    const users = await sequelize.models.User.findAll({ include: [Scan] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await sequelize.models.User.findByPk(req.params.id, { include: [Scan] });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.get("/users/activity/:activity_name", async (req, res) => {
  try {
    const scans = await sequelize.models.Scan.findAll({ 
      where: { activity_name: req.params.activity_name },
      include: [sequelize.models.User]
    });

    const users = scans.map(scan => scan.User);

    res.json(users);
  } catch (error) {
    console.error("Error fetching users by activity:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.listen(port, () => {
  console.log(`GraphQL server running at http://localhost:${port}`);
});