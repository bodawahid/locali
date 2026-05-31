const express = require('express');
const bcrypt = require('bcryptjs');
const { query } = require('../db');
const { signToken, authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    // try DB first
    try {
      const users = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
      if (users.length) {
        const user = users[0];
        if (!user.password_hash || !bcrypt.compareSync(password, user.password_hash)) {
          return res.status(401).json({ error: 'Invalid credentials.' });
        }
        const token = signToken(user);
        return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, city: user.city } });
      }
    } catch (e) {
      console.warn('DB login check failed, falling back to admin hardcoded check.');
    }

    // Fallback temporary admin credentials for initial setup
    if ((email === 'admin' || email === 'admin@locali') && password === 'admin') {
      const adminUser = { id: 0, name: 'Locali Admin', email: 'admin', role: 'admin', phone: null, city: null };
      const token = signToken(adminUser);
      return res.json({ token, user: adminUser, note: 'Temporary admin login (fallback). Update via phpMyAdmin.' });
    }

    return res.status(401).json({ error: 'Invalid credentials.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log in.' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'traveler', phone, city } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (existing.length) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const password_hash = bcrypt.hashSync(password, 10);
    const result = await query(
      'INSERT INTO users (`name`, `email`, `password_hash`, `role`, `phone`, `city`) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, password_hash, role, phone || null, city || null]
    );

    const user = await query('SELECT id, name, email, role, phone, city FROM users WHERE id = ? LIMIT 1', [result.insertId]);
    const token = signToken(user[0]);
    res.status(201).json({ token, user: user[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register user.' });
  }
});

router.get('/me', authenticate, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
