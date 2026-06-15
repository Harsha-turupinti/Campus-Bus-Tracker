import pool from './config/db.js';

async function fixRoutes() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to DB. Fixing route names...');
    
    await connection.query(`UPDATE routes SET route_name = 'Miyapur -> VCE' WHERE id = 1`);
    await connection.query(`UPDATE routes SET route_name = 'Secunderabad -> VCE' WHERE id = 2`);
    await connection.query(`UPDATE routes SET route_name = 'LB Nagar -> VCE' WHERE id = 3`);
    
    console.log('✅ Route names successfully updated to remove Express/Route and use ->');
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('Failed to fix routes:', error);
    process.exit(1);
  }
}

fixRoutes();
