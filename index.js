import express from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import sequelize from "./db.js";

const port = process.env.PORT || 3000;
const app = express();

sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced successfully");
});

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => "Hello, World!",
    },
  },
});

const schema = new GraphQLSchema({
  query: queryType,
});

app.use("/", graphqlHTTP({ schema: schema, graphiql: true }));

app.listen(port, () => {
  console.log(`GraphQL server running at http://localhost:${port}`);
});