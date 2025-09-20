// Database setup script
import { pool } from '../config/db.js';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  try {
    const migrationSQL = fs.readFileSync('./src/db/migrations/001_users.sql', 'utf8');
    await pool.query(migrationSQL);
    console.log('✅ Users table created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();