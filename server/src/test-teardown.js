import pool from './config/db.js';

export default async function teardown() {
  await pool.end();
}