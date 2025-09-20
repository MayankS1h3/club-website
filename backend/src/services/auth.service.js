import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../repositories/user.repo.js';

const ACCESS_TTL = '15m'; 
const JWT_ALG = 'HS256';

export const signup = async({ email, password, jwtSecret }) =>{
  const existing = await findUserByEmail(email);
  if (existing) {
    const err = new Error('Email already in use'); err.status = 409; throw err;
  }
  const password_hash = await argon2.hash(password);
  const user = await createUser({ email, password_hash });
  const token = jwt.sign({ sub: user.id, email: user.email }, jwtSecret, { algorithm: JWT_ALG, expiresIn: ACCESS_TTL });
  return { user, token };
}

export const login = async({ email, password, jwtSecret }) => {
  const user = await findUserByEmail(email);
  if (!user) { const e = new Error('Invalid credentials'); e.status = 401; throw e; }
  const ok = await argon2.verify(user.password_hash, password);
  if (!ok) { const e = new Error('Invalid credentials'); e.status = 401; throw e; }
  const token = jwt.sign({ sub: user.id, email: user.email }, jwtSecret, { algorithm: JWT_ALG, expiresIn: ACCESS_TTL });
  return { user: { id: user.id, email: user.email }, token };
}
