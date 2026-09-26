import pool from '../config/db.js';

export async function listExperience(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT id, title, organization, start_date, end_date, description
       FROM experience
       ORDER BY start_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}