import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./src/graphql/schema.js";
import sequelize from "./db.js";

const app = express();

app.use("/", graphqlHTTP({ schema, graphiql: true }));

sequelize.sync().then(() => {
  console.log("Database synced successfully");
}).catch(err => {
  console.error("Database sync failed:", err);
});

export default app;