import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import AdminUser from '../models/AdminUser.js';
import { asyncHandler, HttpError } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { COOKIE_NAME, cookieOptions, requireAdmin, signToken } from '../middleware/auth.js';
import { loginSchema, changePasswordSchema } from './schemas.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Try again in 15 minutes.' },
});

router.post(
  '/login',
  loginLimiter,
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const user = await AdminUser.findOne({ email: req.body.email }).select('+password');
    // Same message for unknown email / wrong password to avoid account enumeration.
    if (!user || !(await user.comparePassword(req.body.password))) throw new HttpError(401, 'Incorrect email or password');
    user.lastLoginAt = new Date();
    await user.save();
    res.cookie(COOKIE_NAME, signToken(user), cookieOptions());
    res.json({ user });
  })
);

router.post('/logout', (_req, res) => {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions(), maxAge: undefined });
  res.json({ ok: true });
});

router.get('/me', requireAdmin, (req, res) => res.json({ user: req.user }));

router.post(
  '/change-password',
  requireAdmin,
  validate(changePasswordSchema),
  asyncHandler(async (req, res) => {
    const user = await AdminUser.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(req.body.currentPassword))) throw new HttpError(400, 'Current password is incorrect', { currentPassword: 'Current password is incorrect' });
    user.password = req.body.newPassword;
    await user.save();
    res.json({ ok: true });
  })
);

export default router;
