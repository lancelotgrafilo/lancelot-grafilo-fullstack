import pool from '../config/db.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ name, email, message }) {
  const fields = {};

  if (typeof name !== 'string' || name.trim().length < 1 || name.trim().length > 100) {
    fields.name = 'Name is required (max 100 characters).';
  }

  if (typeof email !== 'string' || email.trim().length > 254 || !EMAIL_PATTERN.test(email.trim())) {
    fields.email = 'A valid email address is required.';
  }

  if (typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 2000) {
    fields.message = 'Message must be between 10 and 2000 characters.';
  }

  return fields;
}

export async function createMessage(req, res, next) {
  const fields = validate(req.body || {});

  if (Object.keys(fields).length > 0) {
    return res.status(400).json({ error: 'Please fix the highlighted fields.', fields });
  }

  const { name, email, message } = req.body;

  try {
    await pool.query(
      'INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)',
      [name.trim(), email.trim(), message.trim()]
    );
    res.status(201).json({ message: 'Message received' });
  } catch (err) {
    next(err);
  }
}