import pool from '../config/db.js';

function validateSkill({ name, category }) {
  const fields = {};
  if (typeof name !== 'string' || name.trim().length < 1 || name.trim().length > 100) {
    fields.name = 'Name is required (max 100 characters).';
  }
  if (typeof category !== 'string' || category.trim().length < 1 || category.trim().length > 50) {
    fields.category = 'Category is required (max 50 characters).';
  }
  return fields;
}

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

export async function createSkill(req, res, next) {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const fields = validateSkill(body);
  if (Object.keys(fields).length > 0) {
    return res.status(400).json({ error: 'Please fix the highlighted fields.', fields });
  }

  const sortOrder = Number.isInteger(body.sort_order) ? body.sort_order : 0;

  try {
    const result = await pool.query(
      'INSERT INTO skills (name, category, sort_order) VALUES ($1, $2, $3) RETURNING id',
      [body.name.trim(), body.category.trim(), sortOrder]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    next(err);
  }
}

export async function updateSkill(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid skill id' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const fields = validateSkill(body);
  if (Object.keys(fields).length > 0) {
    return res.status(400).json({ error: 'Please fix the highlighted fields.', fields });
  }

  const sortOrder = Number.isInteger(body.sort_order) ? body.sort_order : 0;

  try {
    const result = await pool.query(
      'UPDATE skills SET name = $1, category = $2, sort_order = $3 WHERE id = $4 RETURNING id',
      [body.name.trim(), body.category.trim(), sortOrder, id]
    );
    if (result.rows.length === 0) {
      const err = new Error('Skill not found');
      err.status = 404;
      return next(err);
    }
    res.json({ id });
  } catch (err) {
    next(err);
  }
}

export async function deleteSkill(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid skill id' });
  }

  try {
    const result = await pool.query('DELETE FROM skills WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      const err = new Error('Skill not found');
      err.status = 404;
      return next(err);
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}