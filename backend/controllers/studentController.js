import { fetchStudentDashboardData } from '../services/studentService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * @route GET /api/student/dashboard
 * @desc Get student dashboard data
 * @access Public (for now)
 */
export const getStudentDashboard = asyncHandler(async (req, res, next) => {
  const email = req.query.college_email;
  
  if (!email) {
    return next(new AppError('college_email query parameter is required', 400));
  }

  // Fetch data via the service layer
  const dashboardData = await fetchStudentDashboardData(email);

  // Return clean JSON response
  res.status(200).json({
    success: true,
    data: dashboardData
  });
});
