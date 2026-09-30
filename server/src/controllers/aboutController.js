import pool from '../config/db.js';
import { cleanText } from '../utils/sanitize.js';

export async function getAbout(req, res, next) {
  try {
    const result = await pool.query('SELECT intro, updated_at FROM about_content WHERE id = 1');
    res.json(result.rows[0] || { intro: '', updated_at: null });
  } catch (err) {
    next(err);
  }
}

export async function updateAbout(req, res, next) {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const intro = cleanText(body.intro, { multiline: true });

  if (typeof intro !== 'string' || intro.length < 1 || intro.length > 2000) {
    return res.status(400).json({
      error: 'Please fix the highlighted fields.',
      fields: { intro: 'Intro is required (max 2000 characters).' },
    });
  }

  try {
    const result = await pool.query(
      'UPDATE about_content SET intro = $1, updated_at = now() WHERE id = 1 RETURNING intro, updated_at',
      [intro]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}