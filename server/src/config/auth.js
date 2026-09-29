import './env.js';

const secret = process.env.JWT_SECRET;

// Fail fast: never run with a missing or weak signing secret
if (!secret || secret.length < 32) {
  console.error('JWT_SECRET is missing or too short (minimum 32 characters).');
  process.exit(1);
}

export const JWT_SECRET = secret;
export const JWT_EXPIRES_IN = '2h';
export const COOKIE_NAME = 'portfolio_token';
export const CSRF_COOKIE_NAME = 'portfolio_csrf';
export const CSRF_HEADER_NAME = 'x-csrf-token';

const baseCookie = {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

export const cookieOptions = { ...baseCookie, maxAge: 2 * 60 * 60 * 1000 };
export const clearCookieOptions = baseCookie;