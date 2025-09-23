import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { findAdminByUsername, findAdminByEmail, createAdmin, updateAdminLastLogin } from '../repositories/admin.repo.js';

const ACCESS_TTL = '8h'; // 8 hours for admin session
const JWT_ALG = 'HS256';

export const adminLogin = async({ username, password, jwtSecret }) => {
  // Try to find admin by username first, then email
  let admin = await findAdminByUsername(username);
  if (!admin) {
    admin = await findAdminByEmail(username); // Allow login with email too
  }
  
  if (!admin) {
    const e = new Error('Invalid credentials');
    e.status = 401;
    throw e;
  }
  
  if (!admin.is_active) {
    const e = new Error('Admin account is disabled');
    e.status = 403;
    throw e;
  }
  
  const ok = await argon2.verify(admin.password_hash, password);
  if (!ok) {
    const e = new Error('Invalid credentials');
    e.status = 401;
    throw e;
  }
  
  // Update last login
  await updateAdminLastLogin(admin.id);
  
  // Generate JWT token with longer expiry for admin
  const token = jwt.sign(
    { 
      sub: admin.id, 
      username: admin.username, 
      email: admin.email,
      type: 'admin' // Important: mark as admin token
    }, 
    jwtSecret, 
    { algorithm: JWT_ALG, expiresIn: ACCESS_TTL }
  );
  
  return { 
    admin: { 
      id: admin.id, 
      username: admin.username, 
      email: admin.email,
      last_login: admin.last_login
    }, 
    token 
  };
}

export const adminSignup = async({ username, email, password }) => {
  // Check if admin already exists
  const existingByUsername = await findAdminByUsername(username);
  if (existingByUsername) {
    const err = new Error('Username already exists');
    err.status = 409;
    throw err;
  }
  
  const existingByEmail = await findAdminByEmail(email);
  if (existingByEmail) {
    const err = new Error('Email already exists');
    err.status = 409;
    throw err;
  }
  
  const password_hash = await argon2.hash(password);
  const admin = await createAdmin({ username, email, password_hash });
  
  return { 
    admin: { 
      id: admin.id, 
      username: admin.username, 
      email: admin.email 
    },
    message: 'Admin account created successfully'
  };
}