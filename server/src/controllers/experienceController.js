import pool from '../config/db.js';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function validateExperience({ title, organization, start_date, end_date, description }) {
  const fields = {};

  if (typeof title !== 'string' || title.trim().length < 1 || title.trim().length > 150) {
    fields.title = 'Title is required (max 150 characters).';
  }
  if (typeof organization !== 'string' || organization.trim().length < 1 || organization.trim().length > 150) {
    fields.organization = 'Organization is required (max 150 characters).';
  }
  if (typeof start_date !== 'string' || !DATE_PATTERN.test(start_date)) {
    fields.start_date = 'A valid start date is required (YYYY-MM-DD).';
  }
  if (end_date !== null && end_date !== '' && end_date !== undefined && !DATE_PATTERN.test(end_date)) {
    fields.end_date = 'End date must be YYYY-MM-DD, or left blank.';
  }
  if (description !== undefined && typeof description === 'string' && description.length > 2000) {
    fields.description = 'Description must be under 2000 characters.';
  }

  return fields;
}

export async function listExperience(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT id, title, organization, start_date, end_date, description
       FROM experience ORDER BY start_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

export async function createExperience(req, res, next) {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const fields = validateExperience(body);
  if (Object.keys(fields).length > 0) {
    return res.status(400).json({ error: 'Please fix the highlighted fields.', fields });
  }

  const endDate = body.end_date ? body.end_date : null;
  const description = typeof body.description === 'string' ? body.description.trim() : '';

  try {
    const result = await pool.query(
      `INSERT INTO experience (title, organization, start_date, end_date, description)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [body.title.trim(), body.organization.trim(), body.start_date, endDate, description]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    next(err);
  }
}

export async function updateExperience(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid experience id' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const fields = validateExperience(body);
  if (Object.keys(fields).length > 0) {
    return res.status(400).json({ error: 'Please fix the highlighted fields.', fields });
  }

  const endDate = body.end_date ? body.end_date : null;
  const description = typeof body.description === 'string' ? body.description.trim() : '';

  try {
    const result = await pool.query(
      `UPDATE experience SET title = $1, organization = $2, start_date = $3, end_date = $4, description = $5
       WHERE id = $6 RETURNING id`,
      [body.title.trim(), body.organization.trim(), body.start_date, endDate, description, id]
    );
    if (result.rows.length === 0) {
      const err = new Error('Experience not found');
      err.status = 404;
      return next(err);
    }
    res.json({ id });
  } catch (err) {
    next(err);
  }
}

export async function deleteExperience(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid experience id' });
  }

  try {
    const result = await pool.query('DELETE FROM experience WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      const err = new Error('Experience not found');
      err.status = 404;
      return next(err);
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}