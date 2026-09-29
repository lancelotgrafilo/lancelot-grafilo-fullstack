import pool from '../config/db.js';

export async function listMessages(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT id, name, email, message, is_read, created_at
       FROM messages
       ORDER BY is_read ASC, created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

export async function markRead(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid message id' });
  }

  try {
    const result = await pool.query(
      'UPDATE messages SET is_read = true WHERE id = $1 RETURNING id, is_read',
      [id]
    );

    if (result.rows.length === 0) {
      const err = new Error('Message not found');
      err.status = 404;
      return next(err);
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function deleteMessage(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid message id' });
  }

  try {
    const result = await pool.query('DELETE FROM messages WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      const err = new Error('Message not found');
      err.status = 404;
      return next(err);
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
}