import { signup, login } from '../services/auth.service.js';
import { env } from '../config/env.js';

const cookieOpts = {
  httpOnly: true,
  secure: false,          
  sameSite: 'lax',
  path: '/',
  maxAge: 15 * 60 * 1000  
};

export async function postSignup(req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, token } = await signup({ email, password, jwtSecret: env.JWT_SECRET });
    res.cookie('access_token', token, cookieOpts);
    res.status(201).json({ id: user.id, email: user.email });
  } catch (e) { next(e); }
}

export async function postLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, token } = await login({ email, password, jwtSecret: env.JWT_SECRET });
    res.cookie('access_token', token, cookieOpts);
    res.json(user);
  } catch (e) { next(e); }
}

export async function postLogout(req, res) {
  res.clearCookie('access_token', { path: '/' });
  res.status(204).end();
}
