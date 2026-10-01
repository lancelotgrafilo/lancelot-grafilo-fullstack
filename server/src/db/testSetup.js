import pool from '../config/db.js';

export async function resetTestData() {
  await pool.query('DELETE FROM messages');
  await pool.query('DELETE FROM project_technologies');
  await pool.query('DELETE FROM projects');
  await pool.query('DELETE FROM technologies');
}