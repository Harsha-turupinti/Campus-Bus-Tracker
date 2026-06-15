import express from 'express';
import { getStudentDashboard } from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { fetchStudentNotifications, fetchStudentSchedule } from '../services/notificationService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

// GET /api/student/dashboard?college_email=xxx@vardhaman.org
router.get('/dashboard', protect, getStudentDashboard);

// GET /api/student/notifications
router.get('/notifications', protect, asyncHandler(async (req, res) => {
  const notifications = await fetchStudentNotifications(req.user.id);
  res.status(200).json({ success: true, data: notifications });
}));

// GET /api/student/schedule
router.get('/schedule', protect, asyncHandler(async (req, res) => {
  const schedule = await fetchStudentSchedule(req.user.id);
  res.status(200).json({ success: true, data: schedule });
}));

export default router;
