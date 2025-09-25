import multer from 'multer';

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

// Create fallback memory storage for when Cloudinary fails
const memoryStorage = multer.memoryStorage();

// Try to create Cloudinary storage, fall back to memory storage
let storage;
try {
  const { eventPosterStorage } = await import('../config/cloudinary.js');
  storage = eventPosterStorage;
  console.log('✅ Using Cloudinary storage for uploads');
} catch (error) {
  console.warn('⚠️ Cloudinary not available, using memory storage:', error.message);
  storage = memoryStorage;
}

// Create upload instance
const createUpload = (storageType) => {
  return multer({
    storage: storageType || storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    }
  });
};

// Export upload configurations
export const uploadEventPoster = createUpload().single('poster');
export const uploadGalleryImage = createUpload().single('image');
export const uploadMultipleGallery = createUpload().array('images', 10);

// Enhanced error handling middleware
export const handleUploadError = (error, req, res, next) => {
  console.error('Upload middleware error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Unexpected field name in upload.' });
    }
    return res.status(400).json({ error: `Upload error: ${error.message}` });
  }
  
  if (error.message && error.message.includes('Invalid file type')) {
    return res.status(400).json({ error: error.message });
  }
  
  // For Cloudinary or network errors, log but continue
  if (error.name === 'CloudinaryError' || 
      (error.message && error.message.toLowerCase().includes('cloudinary'))) {
    console.error('Cloudinary error - continuing without image upload:', error.message);
    // Clear the file from request and continue
    req.file = null;
    req.uploadError = error.message;
    next();
    return;
  }
  
  // For any other error, log and continue without file
  console.error('Unknown upload error - continuing without file:', error);
  req.file = null;
  req.uploadError = error.message;
  next();
};