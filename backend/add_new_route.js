import pool from './config/db.js';

async function addNewRoute() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to DB. Adding new route and bus...');
    
    // 1. Check if route exists, if not insert it
    const [existingRoutes] = await connection.query(`SELECT id FROM routes WHERE route_name = 'Shaikpet -> VCE'`);
    let routeId;
    
    if (existingRoutes.length > 0) {
      routeId = existingRoutes[0].id;
      console.log('Route already exists with ID:', routeId);
    } else {
      const [routeResult] = await connection.query(`
        INSERT INTO routes (route_name, total_distance_km) 
        VALUES ('Shaikpet -> VCE', 28.50)
      `);
      routeId = routeResult.insertId;
      console.log('Inserted new route with ID:', routeId);
      
      // 2. Insert Stops for this route
      await connection.query(`
        INSERT INTO stops (route_id, stop_name, stop_order, latitude, longitude) VALUES
        (?, 'Shaikpet', 1, 17.3980, 78.3965),
        (?, 'Manikonda', 2, 17.3995, 78.3850),
        (?, 'Narsingi', 3, 17.3768, 78.3512),
        (?, 'Shamshabad', 4, 17.2543, 78.4290),
        (?, 'Vardhaman College of Engineering', 5, 17.2260, 78.4370)
      `, [routeId, routeId, routeId, routeId, routeId]);
      console.log('Inserted stops for the new route.');
    }

    // Get the ID of the Shaikpet stop
    const [stops] = await connection.query(`SELECT id FROM stops WHERE route_id = ? AND stop_name = 'Shaikpet'`, [routeId]);
    const shaikpetStopId = stops[0].id;

    // 3. Add the bus VCE-02
    const [existingBuses] = await connection.query(`SELECT id FROM buses WHERE bus_number = 'VCE-02'`);
    if (existingBuses.length === 0) {
      await connection.query(`
        INSERT INTO buses (bus_number, driver_name, route_id, current_lat, current_lng, status) 
        VALUES ('VCE-02', 'Mahesh Babu', ?, 17.3980, 78.3965, 'On Route')
      `, [routeId]);
      console.log('Inserted new bus VCE-02.');
    } else {
      console.log('Bus VCE-02 already exists.');
    }

    // 4. Assign Charan to this route and stop
    await connection.query(`
      UPDATE students 
      SET route_id = ?, boarding_stop_id = ? 
      WHERE college_email = '24881a05em@student.vardhaman.org'
    `, [routeId, shaikpetStopId]);
    
    console.log('✅ Updated Charan to use the new route and stop!');
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('Failed to update DB:', error);
    process.exit(1);
  }
}

addNewRoute();
