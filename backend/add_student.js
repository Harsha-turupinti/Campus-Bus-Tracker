import pool from './config/db.js';

async function addStudent() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to DB. Adding student Charan...');
    
    await connection.query(`
      INSERT INTO students (name, college_email, password_hash, route_id, boarding_stop_id)
      VALUES ('Charan', '24881a05em@student.vardhaman.org', '$2b$10$DGIo5CP8MQfcLsXVT2QoluyJfBTGeWNGd1dwAaEuRbcTvwwfSbNBm', 1, 1)
    `);
    
    console.log('✅ Student Charan added successfully!');
    
    connection.release();
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('✅ Student Charan already exists in the DB.');
      process.exit(0);
    } else {
      console.error('Failed to add student:', error);
      process.exit(1);
    }
  }
}

addStudent();
