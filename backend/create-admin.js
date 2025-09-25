// Script to create an admin user for testing
import { pool } from './src/config/db.js';
import argon2 from 'argon2';

async function createAdminUser() {
  try {
    // Hash the password
    const password = 'admin123'; // Default password for testing
    const hashedPassword = await argon2.hash(password);
    
    // Insert admin user
    const query = `
      INSERT INTO admin_users (username, email, password_hash) 
      VALUES ($1, $2, $3)
      ON CONFLICT (username) DO UPDATE SET 
        password_hash = $3,
        email = $2
      RETURNING id, username, email;
    `;
    
    const result = await pool.query(query, ['admin', 'admin@club.com', hashedPassword]);
    
    console.log('✅ Admin user created successfully:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email: admin@club.com');
    console.log('User ID:', result.rows[0].id);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
    process.exit(1);
  }
}

createAdminUser();