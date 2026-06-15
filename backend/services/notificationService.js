import db from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Fetch notifications for a student by their ID
 */
export const fetchStudentNotifications = async (studentId) => {
  const [rows] = await db.query(
    'SELECT id, message, created_at FROM notifications WHERE student_id = ? ORDER BY created_at DESC',
    [studentId]
  );
  return rows;
};

/**
 * Fetch schedule for a student's assigned route (all buses + stop arrival times)
 */
export const fetchStudentSchedule = async (studentId) => {
  // Get student's route
  const [studentRows] = await db.query(
    'SELECT route_id FROM students WHERE id = ?',
    [studentId]
  );
  if (studentRows.length === 0) {
    throw new AppError('Student not found', 404);
  }
  const routeId = studentRows[0].route_id;

  // Get route info
  const [routeRows] = await db.query(
    'SELECT id, route_name, total_distance_km FROM routes WHERE id = ?',
    [routeId]
  );
  const route = routeRows[0] || null;

  // Get all stops for this route
  const [stops] = await db.query(
    'SELECT id, stop_name, stop_order, latitude, longitude FROM stops WHERE route_id = ? ORDER BY stop_order ASC',
    [routeId]
  );

  // Get all buses on this route
  const [buses] = await db.query(
    'SELECT id, bus_number, driver_name, status FROM buses WHERE route_id = ?',
    [routeId]
  );

  // Get schedules for buses on this route
  const [schedules] = await db.query(`
    SELECT sc.bus_id, sc.stop_id, sc.arrival_time, b.bus_number, s.stop_name
    FROM schedules sc
    JOIN buses b ON sc.bus_id = b.id
    JOIN stops s ON sc.stop_id = s.id
    WHERE b.route_id = ?
    ORDER BY sc.bus_id, sc.arrival_time
  `, [routeId]);

  return {
    route: route ? {
      id: route.id,
      name: route.route_name,
      totalDistanceKm: parseFloat(route.total_distance_km)
    } : null,
    stops: stops.map(s => ({
      id: s.id,
      name: s.stop_name,
      order: s.stop_order,
      lat: parseFloat(s.latitude),
      lng: parseFloat(s.longitude)
    })),
    buses: buses.map(b => ({
      id: b.id,
      number: b.bus_number,
      driver: b.driver_name,
      status: b.status
    })),
    schedules: schedules.map(sc => ({
      busId: sc.bus_id,
      busNumber: sc.bus_number,
      stopId: sc.stop_id,
      stopName: sc.stop_name,
      arrivalTime: sc.arrival_time
    }))
  };
};
