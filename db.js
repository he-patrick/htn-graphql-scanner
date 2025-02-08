import { Sequelize } from "sequelize";

const databaseUrl = process.env.DATABASE_URL || "postgres://postgres:password@localhost:5432/htn_backend_challenge";

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: false,
});

export default sequelize;
