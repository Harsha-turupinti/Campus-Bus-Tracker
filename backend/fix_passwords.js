import 'dotenv/config';
import pool from './config/db.js';
import bcrypt from 'bcryptjs';

async function fixPasswords() {
  try {
    // Generate a fresh hash right here, no shell interpolation issues
    const password = 'student123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    console.log('Generated hash:', hash);
    
    // Verify it works before saving
    const matches = await bcrypt.compare(password, hash);
    console.log('Verification before save:', matches);
    
    if (!matches) {
      console.error('CRITICAL: Hash verification failed before save!');
      process.exit(1);
    }
    
    // Update ALL students with this verified hash
    const [result] = await pool.query('UPDATE students SET password_hash = ?', [hash]);
    console.log(`Updated ${result.affectedRows} students`);
    
    // Read back and verify
    const [rows] = await pool.query('SELECT id, name, college_email, password_hash FROM students');
    for (const row of rows) {
      const ok = await bcrypt.compare(password, row.password_hash);
      console.log(`  ${row.name} (${row.college_email}): ${ok ? '✅ PASS' : '❌ FAIL'}`);
    }
    
    console.log('\nDone! All students can now login with password: student123');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

fixPasswords();
