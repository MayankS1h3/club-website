import { pool } from '../config/db.js';

export const findUserByEmail = async (email) => {
  const { rows } = await pool.query(
    'SELECT id, email, password_hash FROM users WHERE email = $1',
    [email]
  );
  return rows[0] || null;
}

export const createUser = async({ email, password_hash }) => {
  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     RETURNING id, email`,
    [email, password_hash]
  );
  return rows[0];
}
