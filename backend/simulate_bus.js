/**
 * Bus Movement Simulator
 * ----------------------
 * This is a STANDALONE script that simulates bus movement by updating
 * the buses table in the database every few seconds.
 * 
 * The frontend already auto-refreshes every 5s, so the bus marker
 * will move smoothly on the map.
 * 
 * TO START:  node simulate_bus.js
 * TO STOP:   Ctrl+C  (bus stays at last position)
 * TO REMOVE: Just delete this file. No other code depends on it.
 */

import 'dotenv/config';
import pool from './config/db.js';

// Configuration
const TICK_INTERVAL_MS = 4000;  // Move bus every 4 seconds
const STEPS_BETWEEN_STOPS = 15; // Number of intermediate points between two stops

/**
 * Linearly interpolate between two GPS coordinates
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Build a detailed path of GPS waypoints from the stops array
 */
function buildPath(stops) {
  const path = [];
  for (let i = 0; i < stops.length - 1; i++) {
    const from = stops[i];
    const to = stops[i + 1];
    for (let step = 0; step < STEPS_BETWEEN_STOPS; step++) {
      const t = step / STEPS_BETWEEN_STOPS;
      path.push({
        lat: lerp(parseFloat(from.latitude), parseFloat(to.latitude), t),
        lng: lerp(parseFloat(from.longitude), parseFloat(to.longitude), t),
        nearStop: step === 0 ? from.stop_name : null
      });
    }
  }
  // Add the final destination
  const last = stops[stops.length - 1];
  path.push({
    lat: parseFloat(last.latitude),
    lng: parseFloat(last.longitude),
    nearStop: last.stop_name
  });
  return path;
}

async function main() {
  console.log('🚌 Bus Movement Simulator Started');
  console.log('   Press Ctrl+C to stop.\n');

  // Fetch all routes and their stops
  const [routes] = await pool.query('SELECT id, route_name FROM routes');
  
  // Fetch buses that are "On Route"
  const [buses] = await pool.query("SELECT id, bus_number, route_id FROM buses WHERE status = 'On Route'");

  if (buses.length === 0) {
    console.log('⚠️  No buses with status "On Route" found. Exiting.');
    process.exit(0);
  }

  // Build paths for each route
  const routePaths = {};
  for (const route of routes) {
    const [stops] = await pool.query(
      'SELECT stop_name, latitude, longitude FROM stops WHERE route_id = ? ORDER BY stop_order ASC',
      [route.id]
    );
    if (stops.length > 1) {
      routePaths[route.id] = buildPath(stops);
      console.log(`📍 Route "${route.route_name}": ${stops.length} stops → ${routePaths[route.id].length} waypoints`);
    }
  }

  // Track position index for each bus
  const busPositions = {};
  buses.forEach(bus => {
    busPositions[bus.id] = 0;
  });

  // Tick function — moves each bus one step forward
  async function tick() {
    for (const bus of buses) {
      const path = routePaths[bus.route_id];
      if (!path) continue;

      const idx = busPositions[bus.id];
      const point = path[idx];

      // Update the database
      await pool.query(
        'UPDATE buses SET current_lat = ?, current_lng = ? WHERE id = ?',
        [point.lat, point.lng, bus.id]
      );

      // Log movement
      const stopInfo = point.nearStop ? ` 📍 At ${point.nearStop}` : '';
      console.log(`🚌 ${bus.bus_number} → (${point.lat.toFixed(4)}, ${point.lng.toFixed(4)})${stopInfo}`);

      // Advance position (loop back to start when reaching the end)
      busPositions[bus.id] = (idx + 1) % path.length;
    }
  }

  // Run initial tick
  await tick();

  // Set up interval
  const intervalId = setInterval(tick, TICK_INTERVAL_MS);

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Simulator stopped. Bus positions frozen in DB.');
    clearInterval(intervalId);
    process.exit(0);
  });
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
