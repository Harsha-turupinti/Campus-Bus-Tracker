import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a robust connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'campus_bus_tracker',
  waitForConnections: true,
  connectionLimit: 10,  // Maximum number of connections in the pool
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test the connection immediately on server startup
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Successfully connected to MySQL Database: campus_bus_tracker');
    connection.release(); // Return the connection to the pool
  } catch (error) {
    console.error('❌ Failed to connect to MySQL Database:');
    console.error(error.message);
    // Optional: Exit process if database is strictly required on startup
    // process.exit(1); 
  }
};

testConnection();

// Export the pool for use in models/controllers
export default pool;
