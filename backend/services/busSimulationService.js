/**
 * Bus Simulation Service
 * ──────────────────────
 * Runs inside the main server process (no separate script needed).
 * Moves all "On Route" buses along their route stops, updating
 * the database every TICK_INTERVAL_MS milliseconds.
 *
 * Singleton guard prevents multiple intervals from starting.
 * Gracefully handles server restarts — on boot it re-fetches
 * route data and starts fresh from the first waypoint.
 */

import pool from '../config/db.js';

// ── Configuration ──────────────────────────────────────────────
const TICK_INTERVAL_MS = 4000;   // Move bus every 4 seconds
const STEPS_BETWEEN_STOPS = 15;  // Interpolated waypoints between two real stops

// ── Singleton State ────────────────────────────────────────────
let simulationInterval = null;
let isRunning = false;

/**
 * Linear interpolation between two values.
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Build an array of GPS waypoints by interpolating between consecutive stops.
 * Each waypoint has { lat, lng, nearStop }.
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
        nearStop: step === 0 ? from.stop_name : null,
      });
    }
  }
  // Add the final stop itself
  const last = stops[stops.length - 1];
  path.push({
    lat: parseFloat(last.latitude),
    lng: parseFloat(last.longitude),
    nearStop: last.stop_name,
  });
  return path;
}

/**
 * Start the bus movement simulation.
 * Safe to call multiple times — only the first call actually starts it.
 */
export async function startBusSimulation() {
  // ── Singleton guard ──────────────────────────────────────────
  if (isRunning) {
    console.log('⚠️  Bus simulation is already running. Skipping duplicate start.');
    return;
  }
  isRunning = true;

  console.log('\n🚌 ── Bus Movement Simulation ──────────────────────');
  console.log(`   Tick interval : ${TICK_INTERVAL_MS}ms`);
  console.log(`   Waypoints/leg : ${STEPS_BETWEEN_STOPS}`);
  console.log('');

  try {
    // ── 1. Fetch routes & stops ──────────────────────────────
    const [routes] = await pool.query('SELECT id, route_name FROM routes');
    const routePaths = {};

    for (const route of routes) {
      const [stops] = await pool.query(
        'SELECT stop_name, latitude, longitude FROM stops WHERE route_id = ? ORDER BY stop_order ASC',
        [route.id]
      );
      if (stops.length > 1) {
        routePaths[route.id] = buildPath(stops);
        console.log(
          `   📍 Route "${route.route_name}": ${stops.length} stops → ${routePaths[route.id].length} waypoints`
        );
      }
    }

    // ── 2. Fetch active buses ────────────────────────────────
    const [buses] = await pool.query(
      "SELECT id, bus_number, route_id FROM buses WHERE status = 'On Route'"
    );

    if (buses.length === 0) {
      console.log('   ⚠️  No buses with status "On Route" found. Simulation idle.');
      isRunning = false;
      return;
    }

    console.log(`   🚌 Simulating ${buses.length} bus(es)\n`);

    // ── 3. Per-bus position tracking ─────────────────────────
    const busState = {};
    for (const bus of buses) {
      busState[bus.id] = { index: 0, direction: 1 }; // direction: 1 forward, -1 reverse
    }

    // ── 4. Tick: advance each bus one waypoint ───────────────
    async function tick() {
      for (const bus of buses) {
        const path = routePaths[bus.route_id];
        if (!path || path.length === 0) continue;

        const state = busState[bus.id];
        const point = path[state.index];

        // Update the database
        try {
          await pool.query(
            'UPDATE buses SET current_lat = ?, current_lng = ? WHERE id = ?',
            [point.lat, point.lng, bus.id]
          );
        } catch (dbErr) {
          console.error(`   ❌ DB update failed for ${bus.bus_number}:`, dbErr.message);
          continue;
        }

        // Console logging
        const stopInfo = point.nearStop ? `  📍 At: ${point.nearStop}` : '';
        const ts = new Date().toLocaleTimeString();
        console.log(
          `   [${ts}] 🚌 ${bus.bus_number} → (${point.lat.toFixed(6)}, ${point.lng.toFixed(6)})${stopInfo}`
        );

        // Advance position — loop back to start when reaching the end
        const nextIndex = state.index + 1;
        if (nextIndex >= path.length) {
          // Restart from beginning (loop)
          state.index = 0;
          console.log(`   [${ts}] 🔄 ${bus.bus_number} reached end of route — restarting from first stop`);
        } else {
          state.index = nextIndex;
        }
      }
    }

    // ── 5. Run first tick immediately, then schedule ─────────
    await tick();
    simulationInterval = setInterval(tick, TICK_INTERVAL_MS);

    console.log('   ✅ Simulation running. Updates will appear above.\n');

  } catch (err) {
    console.error('   ❌ Failed to start bus simulation:', err.message);
    isRunning = false;
  }
}

/**
 * Stop the simulation (for graceful shutdown).
 */
export function stopBusSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    isRunning = false;
    console.log('🛑 Bus simulation stopped.');
  }
}
