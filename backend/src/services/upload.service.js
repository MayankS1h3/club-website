import { cloudinary } from '../config/cloudinary.js';

export const uploadService = {
  /**
   * Generate a public URL for an uploaded file
   */
  getFileUrl(file) {
    if (!file) return null;
    return file.path || file.secure_url;
  },

  /**
   * Delete a file from Cloudinary
   */
  async deleteFile(fileUrl) {
    try {
      const publicId = this.extractCloudinaryPublicId(fileUrl);
      if (publicId) {
        const result = await cloudinary.uploader.destroy(publicId);
        return result.result === 'ok';
      }
      return false;
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error);
      return false;
    }
  },

  /**
   * Extract Cloudinary public_id from URL
   */
  extractCloudinaryPublicId(url) {
    if (!url || typeof url !== 'string') return null;
    
    // Cloudinary URL pattern: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}.{format}
    const regex = /\/(?:v\d+\/)?(.+)\.\w+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  },

  /**
   * Delete old poster image when updating event
   */
  async deleteOldPoster(oldImageUrl) {
    return await this.deleteFile(oldImageUrl);
  },

  /**
   * Delete gallery image
   */
  async deleteGalleryImage(imageUrl) {
    return await this.deleteFile(imageUrl);
  },

  /**
   * Process uploaded file and return URL and metadata
   */
  processUploadedFile(file) {
    if (!file) return null;
    
    return {
      filename: file.public_id,
      originalName: file.originalname,
      size: file.bytes,
      mimetype: file.format,
      url: file.secure_url,
      cloudinary: {
        public_id: file.public_id,
        version: file.version,
        signature: file.signature,
        width: file.width,
        height: file.height,
        format: file.format,
        resource_type: file.resource_type,
        created_at: file.created_at
      }
    };
  },

  /**
   * Validate file exists in Cloudinary
   */
  async fileExists(fileUrl) {
    try {
      const publicId = this.extractCloudinaryPublicId(fileUrl);
      if (!publicId) return false;
      
      const result = await cloudinary.api.resource(publicId);
      return !!result;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get storage mode info
   */
  getStorageInfo() {
    return {
      mode: 'cloudinary',
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME
    };
  }
};