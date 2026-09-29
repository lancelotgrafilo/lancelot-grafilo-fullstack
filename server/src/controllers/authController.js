import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  COOKIE_NAME,
  cookieOptions,
  clearCookieOptions,
} from '../config/auth.js';
import { cleanText } from '../utils/sanitize.js';

// A real hash of a throwaway string. Comparing against it for unknown emails
// makes those requests take about as long as real ones.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

export async function login(req, res, next) {
  const body =
    req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};

  const email = cleanText(body.email);
  const password = body.password;

  if (
    typeof email !== 'string' ||
    email.length < 3 ||
    email.length > 254 ||
    typeof password !== 'string' ||
    password.length < 1 ||
    password.length > 128
  ) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const result = await pool.query(
      'SELECT id, password_hash FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    const user = result.rows[0];

    // Always run a comparison so timing does not reveal which emails exist
    const valid = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);

    if (!user || !valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ sub: String(user.id) }, JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: JWT_EXPIRES_IN,
    });

    res.cookie(COOKIE_NAME, token, cookieOptions);
    res.json({ message: 'Logged in' });
  } catch (err) {
    next(err);
  }
}

export function logout(req, res) {
  res.clearCookie(COOKIE_NAME, clearCookieOptions);
  res.json({ message: 'Logged out' });
}

export async function me(req, res, next) {
  try {
    const result = await pool.query('SELECT id, email FROM users WHERE id = $1', [req.userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    res.json({ id: user.id, email: user.email });
  } catch (err) {
    next(err);
  }
}