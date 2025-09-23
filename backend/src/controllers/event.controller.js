import { eventService } from '../services/event.service.js';
import { uploadService } from '../services/upload.service.js';

// Admin Controllers (Protected)
export async function createEvent(req, res, next) {
  try {
    const eventData = req.body;
    const adminId = req.admin.id;
    
    // Handle uploaded poster image if present
    if (req.file) {
      const fileInfo = uploadService.processUploadedFile(req.file);
      eventData.poster_image_url = fileInfo.url;
    }
    
    const event = await eventService.createEvent(eventData, adminId);
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllEventsAdmin(req, res, next) {
  try {
    const events = await eventService.getAllEvents();
    
    res.json({
      success: true,
      events,
      count: events.length
    });
  } catch (error) {
    next(error);
  }
}

export async function getEventByIdAdmin(req, res, next) {
  try {
    const eventId = parseInt(req.params.id);
    const event = await eventService.getEventById(eventId);
    
    res.json({
      success: true,
      event
    });
  } catch (error) {
    next(error);
  }
}

export async function updateEvent(req, res, next) {
  try {
    const eventId = parseInt(req.params.id);
    const eventData = req.body;
    
    // Get current event to handle old poster deletion
    const currentEvent = await eventService.getEventById(eventId);
    
    // Handle uploaded poster image if present
    if (req.file) {
      const fileInfo = uploadService.processUploadedFile(req.file);
      eventData.poster_image_url = fileInfo.url;
      
      // Delete old poster if it exists (async, don't wait)
      if (currentEvent && currentEvent.poster_image_url) {
        uploadService.deleteOldPoster(currentEvent.poster_image_url).catch(err => 
          console.error('Failed to delete old poster:', err)
        );
      }
    }
    
    const event = await eventService.updateEvent(eventId, eventData);
    
    res.json({
      success: true,
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteEvent(req, res, next) {
  try {
    const eventId = parseInt(req.params.id);
    
    // Get event to delete associated poster image
    const event = await eventService.getEventById(eventId);
    
    await eventService.deleteEvent(eventId);
    
    // Delete poster image if it exists (async, don't wait)
    if (event && event.poster_image_url) {
      uploadService.deleteOldPoster(event.poster_image_url).catch(err => 
        console.error('Failed to delete event poster:', err)
      );
    }
    
    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}

// Public Controllers (No Auth Required)
export async function getEventCalendar(req, res, next) {
  try {
    const calendar = await eventService.getEventCalendar();
    
    res.json({
      success: true,
      calendar
    });
  } catch (error) {
    next(error);
  }
}

export async function getUpcomingEvents(req, res, next) {
  try {
    const events = await eventService.getUpcomingEvents();
    
    res.json({
      success: true,
      events
    });
  } catch (error) {
    next(error);
  }
}

export async function getTodaysEvents(req, res, next) {
  try {
    const events = await eventService.getTodaysEvents();
    
    res.json({
      success: true,
      events
    });
  } catch (error) {
    next(error);
  }
}

export async function getEventsByMonth(req, res, next) {
  try {
    const { year, month } = req.params;
    const events = await eventService.getEventsByMonth(parseInt(year), parseInt(month));
    
    res.json({
      success: true,
      events,
      year: parseInt(year),
      month: parseInt(month)
    });
  } catch (error) {
    next(error);
  }
}