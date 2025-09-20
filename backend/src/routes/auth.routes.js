import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware.js';
import { signupSchema, loginSchema } from '../schemas/auth.schemas.js';
import { postSignup, postLogin, postLogout } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { env } from '../config/env.js';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({ windowMs: 60_000, max: 30, standardHeaders: true, legacyHeaders: false });

const r = Router();
r.post('/signup', limiter, validate(signupSchema), postSignup);
r.post('/login', limiter, validate(loginSchema), postLogin);
r.post('/logout', postLogout);

// Protected route to test JWT authentication
r.get('/me', requireAuth(env.JWT_SECRET), (req, res) => {
  res.json({ user: req.user, message: 'You are authenticated!' });
});

export default r;
