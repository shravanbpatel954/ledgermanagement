// src/config/db.js
import { Sequelize } from 'sequelize';
// Note: dotenv.config() is called in server.js to ensure proper path resolution
// Validation happens when connection is attempted (in app.js connectToDatabase function)

const sequelize = new Sequelize(
  process.env.DB_NAME || 'edims_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
  }
);

export default sequelize;