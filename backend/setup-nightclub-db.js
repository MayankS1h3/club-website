// Database setup script for nightclub schema
import { pool } from './src/config/db.js';
import fs from 'fs';

async function runNightclubMigration() {
  try {
    const migrationSQL = fs.readFileSync('./src/db/migrations/003_nightclub_schema.sql', 'utf8');
    await pool.query(migrationSQL);
    console.log('✅ Nightclub schema created successfully');
    
    // Create a default admin user
    const defaultAdminSQL = `
      INSERT INTO admin_users (username, email, password_hash) 
      VALUES ('admin', 'admin@club.com', '$argon2id$v=19$m=65536,t=3,p=4$placeholder')
      ON CONFLICT (username) DO NOTHING;
    `;
    await pool.query(defaultAdminSQL);
    console.log('✅ Default admin user placeholder created');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runNightclubMigration();