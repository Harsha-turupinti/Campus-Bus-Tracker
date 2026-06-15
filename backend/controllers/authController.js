import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/errorHandler.js';

export const loginStudent = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    // 1. Check if student exists
    const [rows] = await pool.query(
      'SELECT id, name, college_email, password_hash, route_id, boarding_stop_id FROM students WHERE college_email = ?',
      [email]
    );

    if (rows.length === 0) {
      throw new AppError('Invalid email or password', 401);
    }

    const student = rows[0];

    // 2. Check if password matches
    const isMatch = await bcrypt.compare(password, student.password_hash);

    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    // 3. Generate Token
    const jwtSecret = process.env.JWT_SECRET || 'super_secret_jwt_key_for_development';
    const token = jwt.sign(
      { id: student.id, email: student.college_email, role: 'student' },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // Remove password_hash from response
    delete student.password_hash;

    res.status(200).json({
      success: true,
      token,
      data: {
        user: student
      }
    });

  } catch (error) {
    next(error);
  }
};
