import { doubleCsrf } from 'csrf-csrf';
import { JWT_SECRET, CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from '../config/auth.js';

const { generateCsrfToken, doubleCsrfProtection, invalidCsrfTokenError } = doubleCsrf({
  getSecret: () => JWT_SECRET,
  getSessionIdentifier: (req) => req.cookies?.portfolio_token || 'anonymous',
  cookieName: CSRF_COOKIE_NAME,
  cookieOptions: {
    httpOnly: false,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
  getCsrfTokenFromRequest: (req) => req.headers[CSRF_HEADER_NAME],
});

export { generateCsrfToken, doubleCsrfProtection, invalidCsrfTokenError };