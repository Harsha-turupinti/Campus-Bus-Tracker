import 'dotenv/config';
import pool from './config/db.js';

// Real GPS coordinates sourced from Google Maps / Wikipedia for Hyderabad landmarks
const REAL_COORDINATES = {
  // Route 1: Miyapur → VCE
  'Miyapur':          { lat: 17.4965, lng: 78.3730 },  // Miyapur Metro Station
  'JNTU':             { lat: 17.4967, lng: 78.3925 },  // JNTU Campus
  'KPHB':             { lat: 17.4930, lng: 78.3994 },  // KPHB Colony
  'Kukatpally':       { lat: 17.4851, lng: 78.4094 },  // Kukatpally Bus Stop
  'Moosapet':         { lat: 17.4685, lng: 78.4207 },  // Moosapet Junction
  'Bharat Nagar':     { lat: 17.4633, lng: 78.4289 },  // Bharat Nagar
  'Ameerpet':         { lat: 17.4348, lng: 78.4480 },  // Ameerpet Metro
  'Punjagutta':       { lat: 17.4368, lng: 78.4439 },  // Punjagutta Circle
  'Khairatabad':      { lat: 17.4106, lng: 78.4652 },  // Khairatabad
  'Lakdikapul':       { lat: 17.4034, lng: 78.4652 },  // Lakdikapul
  'Mehdipatnam':      { lat: 17.3959, lng: 78.4312 },  // Mehdipatnam Bus Stand
  'Aramghar':         { lat: 17.3214, lng: 78.4320 },  // Aramghar Crossroads
  'Shamshabad':       { lat: 17.2603, lng: 78.3969 },  // Shamshabad Town
  'Vardhaman College of Engineering': { lat: 17.2546, lng: 78.3070 }, // VCE Kacharam
  
  // Route 2: Secunderabad → VCE
  'Secunderabad Station': { lat: 17.4337, lng: 78.5016 }, // Railway Station
  'Paradise':             { lat: 17.4419, lng: 78.4881 }, // Paradise Circle
  
  // Route 3: LB Nagar → VCE
  'LB Nagar':       { lat: 17.3484, lng: 78.5510 },  // LB Nagar X Roads
  'Dilsukhnagar':   { lat: 17.3688, lng: 78.5247 },  // Dilsukhnagar
};

async function updateCoordinates() {
  let updated = 0;
  let failed = 0;

  try {
    // Fetch all stops
    const [stops] = await pool.query('SELECT id, stop_name FROM stops');
    
    for (const stop of stops) {
      const coords = REAL_COORDINATES[stop.stop_name];
      if (coords) {
        await pool.query(
          'UPDATE stops SET latitude = ?, longitude = ? WHERE id = ?',
          [coords.lat, coords.lng, stop.id]
        );
        console.log(`✅ ${stop.stop_name}: (${coords.lat}, ${coords.lng})`);
        updated++;
      } else {
        console.log(`⚠️  No coordinates found for: ${stop.stop_name}`);
        failed++;
      }
    }

    // Also update the bus positions to be at their route's first stop
    console.log('\n--- Updating bus positions ---');
    const [buses] = await pool.query(`
      SELECT b.id, b.bus_number, s.stop_name, s.latitude, s.longitude
      FROM buses b
      JOIN stops s ON s.route_id = b.route_id AND s.stop_order = 1
    `);
    
    for (const bus of buses) {
      await pool.query(
        'UPDATE buses SET current_lat = ?, current_lng = ? WHERE id = ?',
        [bus.latitude, bus.longitude, bus.id]
      );
      console.log(`🚌 ${bus.bus_number} → starting at ${bus.stop_name} (${bus.latitude}, ${bus.longitude})`);
    }

    console.log(`\n✅ Updated ${updated} stops, ${failed} skipped`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

updateCoordinates();
