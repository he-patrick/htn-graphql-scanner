import express from "express";
import { graphqlHTTP } from "express-graphql";
import sequelize from "./db.js";
import schema from "./graphql/schema.js";

const port = process.env.PORT || 3000;
const app = express();

sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced successfully");
});

app.use("/", graphqlHTTP({ schema, graphiql: true }));

app.listen(port, () => {
  console.log(`GraphQL server running at http://localhost:${port}`);
});