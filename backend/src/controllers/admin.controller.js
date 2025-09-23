import { adminLogin, adminSignup } from '../services/admin.service.js';
import { env } from '../config/env.js';

const adminCookieOpts = {
  httpOnly: true,
  secure: false,          
  sameSite: 'lax',
  path: '/',
  maxAge: 8 * 60 * 60 * 1000  // 8 hours
};

export async function postAdminLogin(req, res, next) {
  try {
    const { username, password } = req.body;
    const { admin, token } = await adminLogin({ username, password, jwtSecret: env.JWT_SECRET });
    
    res.cookie('admin_token', token, adminCookieOpts);
    res.json({ 
      admin,
      message: 'Admin login successful'
    });
  } catch (e) { 
    next(e); 
  }
}

export async function postAdminSignup(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const result = await adminSignup({ username, email, password });
    
    res.status(201).json(result);
  } catch (e) { 
    next(e); 
  }
}

export async function postAdminLogout(req, res) {
  res.clearCookie('admin_token', { path: '/' });
  res.json({ message: 'Admin logout successful' });
}

export async function getAdminProfile(req, res) {
  // This endpoint will be protected by requireAdminAuth middleware
  res.json({ 
    admin: req.admin,
    message: 'Admin authenticated successfully'
  });
}