import pool from '../config/db.js';

export async function listSkills(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT id, name, category, sort_order FROM skills ORDER BY category, sort_order'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}