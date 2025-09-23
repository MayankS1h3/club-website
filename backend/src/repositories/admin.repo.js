import { pool } from '../config/db.js';

export const findAdminByUsername = async (username) => {
  const { rows } = await pool.query(
    'SELECT id, username, email, password_hash, is_active, last_login FROM admin_users WHERE username = $1',
    [username]
  );
  return rows[0] || null;
}

export const findAdminByEmail = async (email) => {
  const { rows } = await pool.query(
    'SELECT id, username, email, password_hash, is_active, last_login FROM admin_users WHERE email = $1',
    [email]
  );
  return rows[0] || null;
}

export const createAdmin = async({ username, email, password_hash }) => {
  const { rows } = await pool.query(
    `INSERT INTO admin_users (username, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, username, email, is_active, created_at`,
    [username, email, password_hash]
  );
  return rows[0];
}

export const updateAdminLastLogin = async (adminId) => {
  const { rows } = await pool.query(
    `UPDATE admin_users 
     SET last_login = NOW()
     WHERE id = $1
     RETURNING id, username, email, last_login`,
    [adminId]
  );
  return rows[0];
}