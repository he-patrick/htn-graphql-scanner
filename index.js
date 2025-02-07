import express from "express";
import { graphqlHTTP } from "express-graphql";
import sequelize from "./db.js";
import schema from "./graphql/schema.js";
import Scan from "./models/Scan.js";

const port = process.env.PORT || 3000;
const app = express();

sequelize.sync({ alter: true }).then(() => {
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


app.listen(port, () => {
  console.log(`GraphQL server running at http://localhost:${port}`);
});