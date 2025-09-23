import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { env } from './env.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for event posters
export const eventPosterStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'nightclub/event-posters',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 1200, crop: 'limit' }, // Limit size for posters
      { quality: 'auto' }, // Automatic quality optimization
      { fetch_format: 'auto' } // Automatic format optimization
    ],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `poster-${uniqueSuffix}`;
    }
  }
});

// Configure Cloudinary storage for gallery images
export const galleryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'nightclub/gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1920, height: 1080, crop: 'limit' }, // Limit size for gallery
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `gallery-${uniqueSuffix}`;
    }
  }
});

// Export configured Cloudinary instance
export { cloudinary };