import multer from 'multer';
import { eventPosterStorage, galleryStorage } from '../config/cloudinary.js';

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

// Create upload instances using Cloudinary storage
const createUpload = (storageType) => {
  const storage = storageType === 'poster' ? eventPosterStorage : galleryStorage;
  
  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    }
  });
};

// Export different upload configurations
export const uploadEventPoster = createUpload('poster').single('poster');
export const uploadGalleryImage = createUpload('gallery').single('image');
export const uploadMultipleGallery = createUpload('gallery').array('images', 10);

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
  console.error('Upload middleware error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Unexpected field name in upload.' });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({ error: error.message });
  }
  
  // Cloudinary or network errors - log but don't fail the request
  if (error.message.includes('cloudinary') || error.name === 'CloudinaryError') {
    console.error('Cloudinary error - proceeding without image:', error.message);
    // Clear the file from request and continue
    req.file = null;
    next();
    return;
  }
  
  next(error);
};