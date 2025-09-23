import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware.js';
import { requireAdminAuth } from '../middlewares/adminAuth.middleware.js';
import { uploadEventPoster, handleUploadError } from '../middlewares/upload.middleware.js';
import { createEventSchema, updateEventSchema, eventIdSchema } from '../schemas/event.schemas.js';
import { 
  createEvent, 
  getAllEventsAdmin, 
  getEventByIdAdmin, 
  updateEvent, 
  deleteEvent,
  getEventCalendar,
  getUpcomingEvents,
  getTodaysEvents,
  getEventsByMonth
} from '../controllers/event.controller.js';
import { env } from '../config/env.js';

const r = Router();

// Admin Routes (Protected)
r.post('/', 
  requireAdminAuth(env.JWT_SECRET),
  uploadEventPoster,
  handleUploadError,
  validate(createEventSchema), 
  createEvent
);

r.get('/admin/all', 
  requireAdminAuth(env.JWT_SECRET), 
  getAllEventsAdmin
);

r.get('/admin/:id', 
  requireAdminAuth(env.JWT_SECRET), 
  validate(eventIdSchema), 
  getEventByIdAdmin
);

r.put('/:id', 
  requireAdminAuth(env.JWT_SECRET),
  uploadEventPoster,
  handleUploadError,
  validate(eventIdSchema), 
  validate(updateEventSchema), 
  updateEvent
);

r.delete('/:id', 
  requireAdminAuth(env.JWT_SECRET), 
  validate(eventIdSchema), 
  deleteEvent
);

// Public Routes (No Auth Required)
r.get('/calendar', getEventCalendar);
r.get('/upcoming', getUpcomingEvents);
r.get('/today', getTodaysEvents);
r.get('/month/:year/:month', getEventsByMonth);

export default r;