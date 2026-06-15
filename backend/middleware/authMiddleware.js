import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';

export const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not authorized to access this route. No token provided.', 401));
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'super_secret_jwt_key_for_development';
    const decoded = jwt.verify(token, jwtSecret);

    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    return next(new AppError('Not authorized to access this route. Invalid token.', 401));
  }
};
