import { pool } from '../config/db.js';

export const createEvent = async(eventData) => {
  const { 
    title, 
    event_type, 
    description, 
    event_date, 
    dj_artist, 
    ticket_price, 
    max_capacity, 
    poster_image_url, 
    created_by 
  } = eventData;

  const { rows } = await pool.query(
    `INSERT INTO events (title, event_type, description, event_date, dj_artist, ticket_price, max_capacity, poster_image_url, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [title, event_type, description, event_date, dj_artist, ticket_price, max_capacity, poster_image_url, created_by]
  );
  return rows[0];
}

export const getAllEvents = async() => {
  const { rows } = await pool.query(
    `SELECT e.*, a.username as created_by_username 
     FROM events e 
     LEFT JOIN admin_users a ON e.created_by = a.id 
     ORDER BY e.event_date DESC`
  );
  return rows;
}

export const getEventById = async(eventId) => {
  const { rows } = await pool.query(
    `SELECT e.*, a.username as created_by_username 
     FROM events e 
     LEFT JOIN admin_users a ON e.created_by = a.id 
     WHERE e.id = $1`,
    [eventId]
  );
  return rows[0] || null;
}

export const getUpcomingEvents = async() => {
  const { rows } = await pool.query(
    `SELECT * FROM events 
     WHERE event_date >= NOW() AND status = 'active'
     ORDER BY event_date ASC`
  );
  return rows;
}

export const getTodaysEvents = async() => {
  const { rows } = await pool.query(
    `SELECT * FROM events 
     WHERE DATE(event_date) = CURRENT_DATE AND status = 'active'
     ORDER BY event_date ASC`
  );
  return rows;
}

export const updateEvent = async(eventId, eventData) => {
  const updateFields = [];
  const values = [];
  let paramCount = 1;

  // Dynamically build update query
  Object.keys(eventData).forEach(key => {
    if (eventData[key] !== undefined) {
      updateFields.push(`${key} = $${paramCount}`);
      values.push(eventData[key]);
      paramCount++;
    }
  });

  // Add updated_at
  updateFields.push(`updated_at = NOW()`);
  values.push(eventId);

  const { rows } = await pool.query(
    `UPDATE events 
     SET ${updateFields.join(', ')}
     WHERE id = $${paramCount}
     RETURNING *`,
    values
  );
  return rows[0] || null;
}

export const deleteEvent = async(eventId) => {
  const { rows } = await pool.query(
    'DELETE FROM events WHERE id = $1 RETURNING *',
    [eventId]
  );
  return rows[0] || null;
}

export const getEventsByDateRange = async(startDate, endDate) => {
  const { rows } = await pool.query(
    `SELECT * FROM events 
     WHERE event_date BETWEEN $1 AND $2 AND status = 'active'
     ORDER BY event_date ASC`,
    [startDate, endDate]
  );
  return rows;
}