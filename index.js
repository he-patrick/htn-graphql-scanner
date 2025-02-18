import awsServerlessExpress from 'aws-serverless-express';
import app from './app.js';
import sequelize from './db.js';

const server = awsServerlessExpress.createServer(app);

sequelize.sync().then(() => {
    console.log("Database synced successfully");
}).catch(err => {
    console.error("Database sync failed:", err);
});

export const handler = (event, context) => {
    awsServerlessExpress.proxy(server, event, context);
};