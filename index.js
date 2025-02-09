import express from "express";
import { graphqlHTTP } from "express-graphql";
import sequelize from "./db.js";
import schema from "./src/graphql/schema.js";

const port = process.env.PORT || 3000;
const app = express();

sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced successfully");

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});

app.use("/", graphqlHTTP({ schema, graphiql: true }));