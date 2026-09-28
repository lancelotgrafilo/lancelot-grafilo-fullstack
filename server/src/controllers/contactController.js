import pool from '../config/db.js';
import { cleanText } from '../utils/sanitize.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ name, email, message }) {
  const fields = {};

  if (typeof name !== 'string' || name.length < 1 || name.length > 100) {
    fields.name = 'Name is required (max 100 characters).';
  }

  if (typeof email !== 'string' || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    fields.email = 'A valid email address is required.';
  }

  if (typeof message !== 'string' || message.length < 10 || message.length > 2000) {
    fields.message = 'Message must be between 10 and 2000 characters.';
  }

  return fields;
}

export async function createMessage(req, res, next) {
  const body =
    req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};

  // Honeypot: real users never see this field, so any value means a bot.
  // Pretend it worked so the bot learns nothing, but save nothing.
  if (body.website) {
    return res.status(201).json({ message: 'Message received' });
  }

  const cleanEmail = cleanText(body.email);

  const clean = {
    name: cleanText(body.name),
    email: typeof cleanEmail === 'string' ? cleanEmail.toLowerCase() : cleanEmail,
    message: cleanText(body.message, { multiline: true }),
  };

  const fields = validate(clean);

  if (Object.keys(fields).length > 0) {
    return res.status(400).json({ error: 'Please fix the highlighted fields.', fields });
  }

  try {
    await pool.query(
      'INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)',
      [clean.name, clean.email, clean.message]
    );
    res.status(201).json({ message: 'Message received' });
  } catch (err) {
    next(err);
  }
}