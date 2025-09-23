#!/usr/bin/env node
/**
 * Quick test script to verify Cloudinary setup
 * Run with: node test-cloudinary.js
 */

import 'dotenv/config';
import { env } from './src/config/env.js';
import { cloudinary } from './src/config/cloudinary.js';

async function testCloudinaryConnection() {
  console.log('🧪 Testing Cloudinary connection...\n');
  
  // Check environment variables
  console.log('📋 Environment Check:');
  console.log(`✅ CLOUDINARY_CLOUD_NAME: ${env.CLOUDINARY_CLOUD_NAME ? 'Set' : '❌ Missing'}`);
  console.log(`✅ CLOUDINARY_API_KEY: ${env.CLOUDINARY_API_KEY ? 'Set' : '❌ Missing'}`);
  console.log(`✅ CLOUDINARY_API_SECRET: ${env.CLOUDINARY_API_SECRET ? 'Set' : '❌ Missing'}\n`);
  
  // Test API connection
  try {
    console.log('🔗 Testing API connection...');
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful!');
    console.log(`📊 API Status: ${result.status}\n`);
    
    // Test folder structure
    console.log('📁 Checking folder structure...');
    try {
      await cloudinary.api.create_folder('nightclub');
      await cloudinary.api.create_folder('nightclub/event-posters');
      await cloudinary.api.create_folder('nightclub/gallery');
      console.log('✅ Folder structure ready!');
    } catch (error) {
      if (error.http_code === 400 && error.message.includes('already exists')) {
        console.log('✅ Folder structure already exists!');
      } else {
        console.log('⚠️ Folder creation warning:', error.message);
      }
    }
    
    console.log('\n🎉 Cloudinary setup is complete and ready for image uploads!');
    console.log('\n📖 Next steps:');
    console.log('1. Start your server: npm run dev');
    console.log('2. Test image upload endpoints');
    console.log('3. Check images in your Cloudinary dashboard');
    
  } catch (error) {
    console.error('❌ Cloudinary connection failed:');
    console.error(`Error: ${error.message}`);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Verify your Cloudinary credentials in .env');
    console.error('2. Check your internet connection');
    console.error('3. Ensure your Cloudinary account is active');
    process.exit(1);
  }
}

testCloudinaryConnection();