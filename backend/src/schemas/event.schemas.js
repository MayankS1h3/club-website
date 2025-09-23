import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Event title is required').max(255, 'Title too long'),
    event_type: z.string().min(1, 'Event type is required'),
    description: z.string().optional(),
    event_date: z.string().datetime('Invalid date format. Use ISO datetime string'),
    dj_artist: z.string().optional(),
    ticket_price: z.number().min(0, 'Ticket price must be positive').default(0),
    max_capacity: z.number().int().min(1, 'Max capacity must be at least 1'),
    poster_image_url: z.string().url('Invalid poster image URL').optional()
  })
});

export const updateEventSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    event_type: z.string().min(1).optional(),
    description: z.string().optional(),
    event_date: z.string().datetime().optional(),
    dj_artist: z.string().optional(),
    ticket_price: z.number().min(0).optional(),
    max_capacity: z.number().int().min(1).optional(),
    poster_image_url: z.string().url().optional(),
    status: z.enum(['active', 'cancelled', 'sold_out']).optional()
  })
});

export const eventIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Event ID must be a number')
  })
});