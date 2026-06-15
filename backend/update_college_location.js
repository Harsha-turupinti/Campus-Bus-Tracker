import pool from './config/db.js';

async function updateCollegeLocation() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to DB. Standardizing Vardhaman College of Engineering coordinates...');
    
    await connection.query(`
      UPDATE stops 
      SET latitude = 17.2546, longitude = 78.3070 
      WHERE stop_name = 'Vardhaman College of Engineering'
    `);
    
    console.log('✅ College coordinates standardized across all routes in the database!');
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('Failed to update college coordinates:', error);
    process.exit(1);
  }
}

updateCollegeLocation();
