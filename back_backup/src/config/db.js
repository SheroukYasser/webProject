import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Ensure dotenv is loaded (safe to call multiple times)
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

export default sequelize;