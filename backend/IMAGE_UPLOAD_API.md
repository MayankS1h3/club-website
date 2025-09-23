# Cloudinary Image Upload API Documentation

## Overview
The nightclub website backend uses **Cloudinary** for all image storage and management. This provides automatic optimization, CDN delivery, and transformations for event posters and gallery images.

## Configuration Required
Before using image uploads, set up your Cloudinary credentials in `.env`:
```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Get these from your [Cloudinary Dashboard](https://cloudinary.com/console).

## Endpoints

### Upload Event Poster
**POST** `/api/v1/uploads/event-poster`
- **Auth**: Admin authentication required
- **Content-Type**: `multipart/form-data`
- **Field**: `poster` (single file)
- **Transformations**: Automatically resized to max 800x1200, optimized quality
- **Response**: 
```json
{
  "success": true,
  "message": "Event poster uploaded successfully",
  "file": {
    "filename": "poster-1695465123456-789123456",
    "originalName": "concert-poster.jpg",
    "size": 1048576,
    "mimetype": "jpg",
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1695465123/nightclub/event-posters/poster-1695465123456-789123456.jpg",
    "cloudinary": {
      "public_id": "nightclub/event-posters/poster-1695465123456-789123456",
      "version": 1695465123,
      "width": 800,
      "height": 1200,
      "format": "jpg"
    }
  }
}
```

### Upload Gallery Image
**POST** `/api/v1/uploads/gallery-image`
- **Auth**: Admin authentication required
- **Content-Type**: `multipart/form-data`
- **Field**: `image` (single file)
- **Transformations**: Automatically resized to max 1920x1080, optimized quality

### Upload Multiple Gallery Images
**POST** `/api/v1/uploads/gallery-images`
- **Auth**: Admin authentication required
- **Content-Type**: `multipart/form-data`
- **Field**: `images` (multiple files, max 10)
- **Transformations**: Each image resized to max 1920x1080, optimized quality

### Delete Uploaded File
**DELETE** `/api/v1/uploads/file`
- **Auth**: Admin authentication required
- **Body**:
```json
{
  "fileUrl": "https://res.cloudinary.com/your-cloud/image/upload/v123/nightclub/event-posters/poster-123456.jpg"
}
```

## Automatic Image Optimizations

### Event Posters
- **Max dimensions**: 800x1200 pixels
- **Quality**: Automatic optimization
- **Format**: Auto-converted to best format (WebP when supported)
- **Folder**: `nightclub/event-posters/`

### Gallery Images
- **Max dimensions**: 1920x1080 pixels  
- **Quality**: Automatic optimization
- **Format**: Auto-converted to best format (WebP when supported)
- **Folder**: `nightclub/gallery/`

## Event Creation with Image Upload

### Create Event with Poster
**POST** `/api/v1/events`
- **Auth**: Admin authentication required
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `poster` (file, optional)
  - `title` (string)
  - `event_type` (string)
  - `description` (string, optional)
  - `event_date` (ISO datetime string)
  - `dj_artist` (string, optional)
  - `ticket_price` (number)
  - `max_capacity` (number)

### Update Event with New Poster
**PUT** `/api/v1/events/:id`
- **Auth**: Admin authentication required
- **Content-Type**: `multipart/form-data`
- **Note**: Uploading a new poster will automatically delete the old one

## File Validation

### Supported File Types
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

### File Size Limits
- Maximum file size: 5MB per file

### Security Features
- Admin authentication required for all uploads
- File type validation
- Filename sanitization with unique timestamps
- Automatic cleanup when events are deleted or posters are replaced

## Storage Structure (Cloudinary)
```
Cloudinary Cloud:
└── nightclub/
    ├── event-posters/    # Event poster images (800x1200 max)
    │   └── poster-*.jpg/png/webp
    └── gallery/          # Gallery images (1920x1080 max)
        └── gallery-*.jpg/png/webp
```

All images are:
- ✅ **Automatically optimized** for web delivery
- ✅ **Delivered via global CDN** for fast loading
- ✅ **Auto-converted** to best format (WebP when supported)
- ✅ **Responsive** with on-the-fly transformations available

## Error Responses

### File Too Large
```json
{
  "error": "File too large. Maximum size is 5MB."
}
```

### Invalid File Type
```json
{
  "error": "Invalid file type. Only JPEG, PNG, and WebP images are allowed."
}
```

### No File Uploaded
```json
{
  "error": "No file uploaded"
}
```

### Unauthorized
```json
{
  "error": "Admin authentication required"
}
```

## Usage Examples

### Frontend Form for Event Creation
```html
<form enctype="multipart/form-data">
  <input type="file" name="poster" accept="image/*" />
  <input type="text" name="title" required />
  <input type="text" name="event_type" required />
  <textarea name="description"></textarea>
  <input type="datetime-local" name="event_date" required />
  <input type="text" name="dj_artist" />
  <input type="number" name="ticket_price" step="0.01" />
  <input type="number" name="max_capacity" required />
  <button type="submit">Create Event</button>
</form>
```

### JavaScript Upload Example
```javascript
const formData = new FormData();
formData.append('poster', fileInput.files[0]);
formData.append('title', 'Saturday Night Party');
formData.append('event_type', 'party');
formData.append('event_date', '2025-09-25T21:00:00Z');
formData.append('ticket_price', '25.00');
formData.append('max_capacity', '200');

fetch('/api/v1/events', {
  method: 'POST',
  body: formData,
  credentials: 'include' // Include admin cookies
});
```

## Static File Access
Uploaded images are publicly accessible via Cloudinary CDN:
- Event posters: `https://res.cloudinary.com/your-cloud/image/upload/nightclub/event-posters/filename.jpg`
- Gallery images: `https://res.cloudinary.com/your-cloud/image/upload/nightclub/gallery/filename.jpg`

### Cloudinary Benefits
- ✅ **Global CDN**: Fast loading worldwide
- ✅ **Auto-optimization**: Best quality/size ratio
- ✅ **Format conversion**: WebP when supported, fallback to JPEG/PNG
- ✅ **On-demand transformations**: Resize, crop, effects available
- ✅ **Free tier**: 25GB storage + 25GB bandwidth/month
- ✅ **Persistent**: Never lose images on deployment