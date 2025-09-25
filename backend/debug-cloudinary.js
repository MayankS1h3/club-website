import { v2 as cloudinary } from 'cloudinary';
import { env } from './src/config/env.js';

console.log('🔍 Cloudinary Debug Test\n');

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

console.log('📋 Configuration:');
console.log(`Cloud Name: ${env.CLOUDINARY_CLOUD_NAME}`);
console.log(`API Key: ${env.CLOUDINARY_API_KEY}`);
console.log(`API Secret: ${env.CLOUDINARY_API_SECRET ? '***' + env.CLOUDINARY_API_SECRET.slice(-4) : 'NOT SET'}\n`);

async function debugCloudinary() {
  try {
    console.log('🔗 Testing basic connection...');
    const pingResult = await cloudinary.api.ping();
    console.log('✅ Ping successful:', pingResult);
    
    console.log('\n📊 Testing account info...');
    const usage = await cloudinary.api.usage();
    console.log('✅ Account usage:', {
      transformations: usage.transformations,
      objects: usage.objects,
      bandwidth: usage.bandwidth,
      storage: usage.storage
    });
    
    console.log('\n📁 Testing folder creation...');
    try {
      await cloudinary.api.create_folder('nightclub/test-debug');
      console.log('✅ Folder created successfully');
    } catch (folderError) {
      if (folderError.error?.message?.includes('already exists')) {
        console.log('✅ Folder already exists');
      } else {
        console.log('⚠️ Folder creation error:', folderError.error?.message);
      }
    }
    
    console.log('\n🖼️ Testing simple text upload...');
    const uploadResult = await cloudinary.uploader.upload('data:text/plain;base64,SGVsbG8gQ2xvdWRpbmFyeQ==', {
      folder: 'nightclub/test-debug',
      public_id: 'test-upload-' + Date.now(),
      resource_type: 'raw'
    });
    console.log('✅ Test upload successful:', {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
      resource_type: uploadResult.resource_type
    });
    
    console.log('\n🗑️ Cleaning up test file...');
    await cloudinary.uploader.destroy(uploadResult.public_id, { resource_type: 'raw' });
    console.log('✅ Test file deleted');
    
    console.log('\n🎉 All Cloudinary tests passed! Your credentials are working correctly.');
    
  } catch (error) {
    console.error('\n❌ Cloudinary test failed:');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    
    if (error.error) {
      console.error('HTTP Status:', error.error.http_code);
      console.error('Error details:', error.error.message);
    }
    
    console.log('\n🔧 Troubleshooting suggestions:');
    if (error.error?.http_code === 401) {
      console.log('- Check your API credentials (they might be invalid)');
      console.log('- Verify your account is active');
    } else if (error.error?.http_code === 403) {
      console.log('- Check your account permissions');
      console.log('- Verify your plan supports the operation');
    } else if (error.message?.includes('ENOTFOUND') || error.message?.includes('network')) {
      console.log('- Check your internet connection');
      console.log('- Check if you\'re behind a proxy/firewall');
    } else {
      console.log('- Double-check your credentials in the .env file');
      console.log('- Try regenerating your API credentials in Cloudinary dashboard');
    }
    
    process.exit(1);
  }
}

debugCloudinary();