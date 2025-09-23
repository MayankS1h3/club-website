import { Router } from 'express';
import { requireAdminAuth } from '../middlewares/adminAuth.middleware.js';
import { uploadEventPoster, uploadGalleryImage, uploadMultipleGallery, handleUploadError } from '../middlewares/upload.middleware.js';
import { uploadService } from '../services/upload.service.js';
import { env } from '../config/env.js';

const r = Router();

// All upload routes require admin authentication
r.use(requireAdminAuth(env.JWT_SECRET));

// Storage info endpoint (helpful for debugging)
r.get('/info', (req, res) => {
  const storageInfo = uploadService.getStorageInfo();
  res.json({
    success: true,
    storage: storageInfo
  });
});

// Upload event poster
r.post('/event-poster', uploadEventPoster, handleUploadError, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileInfo = uploadService.processUploadedFile(req.file);
    
    res.json({
      success: true,
      message: 'Event poster uploaded successfully',
      file: fileInfo
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process uploaded file' });
  }
});

// Upload gallery image
r.post('/gallery-image', uploadGalleryImage, handleUploadError, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileInfo = uploadService.processUploadedFile(req.file);
    
    res.json({
      success: true,
      message: 'Gallery image uploaded successfully',
      file: fileInfo
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process uploaded file' });
  }
});

// Upload multiple gallery images
r.post('/gallery-images', uploadMultipleGallery, handleUploadError, (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const filesInfo = req.files.map(file => 
      uploadService.processUploadedFile(file)
    );
    
    res.json({
      success: true,
      message: `${req.files.length} gallery images uploaded successfully`,
      files: filesInfo
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process uploaded files' });
  }
});

// Delete uploaded file (admin only)
r.delete('/file', async (req, res) => {
  try {
    const { fileUrl } = req.body;
    
    if (!fileUrl) {
      return res.status(400).json({ error: 'File URL is required' });
    }

    const deleted = await uploadService.deleteFile(fileUrl);

    if (deleted) {
      res.json({ success: true, message: 'File deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found or could not be deleted' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default r;