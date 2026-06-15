import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// 1. Validate environment variables
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_NAME'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`⚠️ Warning: Environment variable ${envVar} is missing. Falling back to defaults.`);
  }
}

// 2. Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'campus_bus_tracker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// 3. Test database connection
export const testDbConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ Successfully connected to MySQL Database: ${process.env.DB_NAME || 'campus_bus_tracker'}`);
    connection.release();
  } catch (error) {
    console.error('❌ FATAL: Failed to connect to MySQL Database:', error.message);
    process.exit(1); // Exit process if DB connection fails in production
  }
};

export default pool;
