import db from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Fetch the complete student dashboard data based on college email
 * @param {string} email 
 * @returns {Object} Dashboard data
 */
export const fetchStudentDashboardData = async (email) => {
  // 1. Fetch student, route, bus, and boarding stop details
  const studentQuery = `
    SELECT
      s.id AS student_id,
      s.name AS student_name,
      s.college_email,
      r.id AS route_id,
      r.route_name,
      b.bus_number,
      b.driver_name,
      b.current_lat,
      b.current_lng,
      b.status AS bus_status,
      st.id AS boarding_stop_id,
      st.stop_name AS boarding_stop_name,
      st.latitude AS boarding_stop_lat,
      st.longitude AS boarding_stop_lng
    FROM students s
    LEFT JOIN routes r ON s.route_id = r.id
    LEFT JOIN buses b ON b.route_id = r.id
    LEFT JOIN stops st ON s.boarding_stop_id = st.id
    WHERE s.college_email = ?
    LIMIT 1
  `;
  
  const [studentRows] = await db.query(studentQuery, [email]);

  if (studentRows.length === 0) {
    throw new AppError('Student not found with the provided email', 404);
  }

  const studentData = studentRows[0];
  const routeId = studentData.route_id;

  // 2. Fetch all route stops if assigned a route
  let routeStops = [];
  if (routeId) {
    const stopsQuery = `
      SELECT id, stop_name, stop_order, latitude, longitude
      FROM stops
      WHERE route_id = ?
      ORDER BY stop_order ASC
    `;
    const [stopsRows] = await db.query(stopsQuery, [routeId]);
    routeStops = stopsRows;
  }

  // 3. Format the response data cleanly
  return {
    student: {
      id: studentData.student_id,
      name: studentData.student_name,
      email: studentData.college_email,
    },
    route: {
      id: studentData.route_id,
      name: studentData.route_name,
    },
    bus: {
      number: studentData.bus_number,
      driver: studentData.driver_name,
      status: studentData.bus_status,
      location: {
        lat: parseFloat(studentData.current_lat) || null,
        lng: parseFloat(studentData.current_lng) || null,
      }
    },
    boardingStop: {
      id: studentData.boarding_stop_id,
      name: studentData.boarding_stop_name,
      lat: parseFloat(studentData.boarding_stop_lat) || null,
      lng: parseFloat(studentData.boarding_stop_lng) || null,
    },
    routeStops: routeStops.map(stop => ({
      id: stop.id,
      name: stop.stop_name,
      order: stop.stop_order,
      lat: parseFloat(stop.latitude),
      lng: parseFloat(stop.longitude)
    }))
  };
};
