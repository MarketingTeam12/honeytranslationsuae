import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbGet } from '../db/connection.js';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config.js';
import { requireAdminAuth } from '../middleware/auth.js';

const router = Router();
const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await dbGet(
    'SELECT id, username, email, password, created_at FROM admins WHERE email = ?',
    [email],
  );
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { sub: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.created_at,
    },
  });
}));

router.post('/logout', (_req, res) => {
  res.json({ success: true });
});

router.get('/me', requireAdminAuth, asyncHandler(async (req, res) => {
  const user = await dbGet(
    'SELECT id, username, email, created_at FROM admins WHERE id = ?',
    [req.admin.sub],
  );

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.created_at,
    },
  });
}));

export default router;
