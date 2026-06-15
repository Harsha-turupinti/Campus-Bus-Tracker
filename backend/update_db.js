import pool from './config/db.js';

async function updateDb() {
  try {
    console.log('Adding password_hash column...');
    await pool.query('ALTER TABLE students ADD COLUMN password_hash VARCHAR(255) AFTER college_email');
    
    console.log('Updating student password...');
    // student123 hash
    const hash = '$2b$10$DGIo5CP8MQfcLsXVT2QoluyJfBTGeWNGd1dwAaEuRbcTvwwfSbNBm';
    await pool.query('UPDATE students SET password_hash = ? WHERE college_email = ?', [hash, 'student@vardhaman.org']);
    
    // other students
    await pool.query('UPDATE students SET password_hash = ? WHERE college_email != ?', [hash, 'student@vardhaman.org']);
    
    console.log('Database update successful!');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Column already exists.');
    } else {
      console.error('Error updating db:', error);
    }
  } finally {
    process.exit();
  }
}

updateDb();
