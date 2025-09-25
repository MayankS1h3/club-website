import multer from 'multer';

// For now, let's use a simple memory storage as fallback when Cloudinary fails
const memoryStorage = multer.memoryStorage();

// Create a fallback upload that stores in memory but doesn't upload to Cloudinary
const createFallbackUpload = () => {
  return multer({
    storage: memoryStorage,
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    }
  });
};

// Try to use Cloudinary, fall back to memory storage if it fails
let uploadEventPoster, uploadGalleryImage, uploadMultipleGallery;

try {
  // Try to import Cloudinary storage
  const { eventPosterStorage, galleryStorage } = await import('../config/cloudinary.js');
  
  uploadEventPoster = multer({
    storage: eventPosterStorage,
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    }
  }).single('poster');
  
  uploadGalleryImage = multer({
    storage: galleryStorage,
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024,
    }
  }).single('image');
  
  uploadMultipleGallery = multer({
    storage: galleryStorage,
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024,
    }
  }).array('images', 10);
  
  console.log('✅ Cloudinary upload configured successfully');
  
} catch (error) {
  console.warn('⚠️ Cloudinary not available, using fallback storage:', error.message);
  
  // Use fallback memory storage
  const fallbackUpload = createFallbackUpload();
  uploadEventPoster = fallbackUpload.single('poster');
  uploadGalleryImage = fallbackUpload.single('image');
  uploadMultipleGallery = fallbackUpload.array('images', 10);
}

// Error handling middleware
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
  
  // For any other error, log it but continue without the file
  console.error('Upload error, proceeding without file:', error.message);
  req.file = null;
  next();
};

export { uploadEventPoster, uploadGalleryImage, uploadMultipleGallery };