import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import awsServerlessExpress from "aws-serverless-express";
import schema from "./src/graphql/schema.js";
import sequelize from "./db.js";

const allowedOrigin = "https://v0-graph-ql-api-client-wfbs1y.vercel.app";

const app = express();

app.use(cors({ origin: allowedOrigin }));

app.options("*", (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "content-type,authorization,x-amz-date,x-api-key,x-amz-security-token",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
  });
  res.sendStatus(200);
});

app.use(
  "/",
  graphqlHTTP({
    schema,
    graphiql: false,
  })
);

// Sync database
sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((err) => {
    console.error("Database sync failed:", err);
    process.exit(1);
  });

const server = awsServerlessExpress.createServer(app);

export const handler = (event, context) => {
  return awsServerlessExpress.proxy(server, event, context, "PROMISE").promise;
};
