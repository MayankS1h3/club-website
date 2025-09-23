import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware.js';
import { adminLoginSchema, adminSignupSchema } from '../schemas/admin.schemas.js';
import { postAdminLogin, postAdminSignup, postAdminLogout, getAdminProfile } from '../controllers/admin.controller.js';
import { requireAdminAuth } from '../middlewares/adminAuth.middleware.js';
import { env } from '../config/env.js';
import rateLimit from 'express-rate-limit';

// Stricter rate limiting for admin endpoints
const adminLimiter = rateLimit({ 
  windowMs: 60_000, 
  max: 10, // Only 10 attempts per minute
  standardHeaders: true, 
  legacyHeaders: false,
  message: { error: 'Too many admin login attempts, please try again later' }
});

const r = Router();

// Public admin endpoints
r.post('/login', adminLimiter, validate(adminLoginSchema), postAdminLogin);
r.post('/signup', adminLimiter, validate(adminSignupSchema), postAdminSignup);
r.post('/logout', postAdminLogout);

// Protected admin endpoints
r.get('/profile', requireAdminAuth(env.JWT_SECRET), getAdminProfile);

export default r;