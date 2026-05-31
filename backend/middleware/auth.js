const jwt = require('jsonwebtoken');
const { query } = require('../db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

function getToken(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}

async function authenticate(req, res, next) {
  const token = getToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication token required' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const users = await query('SELECT id, name, email, role, phone, city FROM users WHERE id = ?', [payload.userId]);
    if (!users.length) {
      // allow fallback admin token (userId 0) which is not persisted in DB
      if (payload.userId === 0 && payload.role === 'admin') {
        req.user = { id: 0, name: 'fallback admin', email: 'admin@local', role: 'admin' };
        return next();
      }
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = users[0];
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ error: 'Permission denied' });
    next();
  };
}

function signToken(user) {
  return jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

function getToken(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}

module.exports = {
  authenticate,
  authorizeRole,
  signToken,
  getToken,
};
