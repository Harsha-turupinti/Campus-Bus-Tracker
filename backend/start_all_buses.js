import pool from './config/db.js';

async function startAllBuses() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to DB. Setting all buses to "On Route"...');
    
    await connection.query(`UPDATE buses SET status = 'On Route'`);
    
    console.log('✅ All buses are now On Route!');
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('Failed to update buses:', error);
    process.exit(1);
  }
}

startAllBuses();
