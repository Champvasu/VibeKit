import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV !== 'development') {
  console.warn('[auth] JWT_SECRET is not set — using insecure fallback. Set it in .env.local.');
}

const SECRET = JWT_SECRET || 'dev-fallback-secret-do-not-use-in-production';

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

/**
 * Extracts Bearer token from Authorization header.
 */
function getToken(req) {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

/**
 * HOC that wraps an API handler to require a valid JWT.
 * Injects req.userId on success.
 */
export function requireAuth(handler) {
  return async (req, res) => {
    const token = getToken(req);
    if (!token) {
      return res.status(401).json({ error: 'No token provided.' });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
    }
    req.userId = decoded.userId;
    return handler(req, res);
  };
}
