import { 
  createEvent, 
  getAllEvents, 
  getEventById, 
  getUpcomingEvents, 
  getTodaysEvents,
  updateEvent, 
  deleteEvent,
  getEventsByDateRange
} from '../repositories/event.repo.js';

export const eventService = {
  async createEvent(eventData, adminId) {
    const eventWithAdmin = {
      ...eventData,
      created_by: adminId
    };
    
    return await createEvent(eventWithAdmin);
  },

  async getAllEvents() {
    return await getAllEvents();
  },

  async getEventById(eventId) {
    const event = await getEventById(eventId);
    if (!event) {
      const error = new Error('Event not found');
      error.status = 404;
      throw error;
    }
    return event;
  },

  async getUpcomingEvents() {
    return await getUpcomingEvents();
  },

  async getTodaysEvents() {
    return await getTodaysEvents();
  },

  async updateEvent(eventId, eventData) {
    const event = await getEventById(eventId);
    if (!event) {
      const error = new Error('Event not found');
      error.status = 404;
      throw error;
    }

    return await updateEvent(eventId, eventData);
  },

  async deleteEvent(eventId) {
    const event = await getEventById(eventId);
    if (!event) {
      const error = new Error('Event not found');
      error.status = 404;
      throw error;
    }

    return await deleteEvent(eventId);
  },

  async getEventCalendar() {
    const today = new Date();
    const todaysEvents = await getTodaysEvents();
    const upcomingEvents = await getUpcomingEvents();
    
    return {
      today: todaysEvents,
      upcoming: upcomingEvents.filter(event => 
        new Date(event.event_date).toDateString() !== today.toDateString()
      )
    };
  },

  async getEventsByMonth(year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    return await getEventsByDateRange(startDate, endDate);
  }
};