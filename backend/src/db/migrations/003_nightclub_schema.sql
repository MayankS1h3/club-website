-- Nightclub Database Schema - Core Features Only

-- Admin users table (needs to be created first for foreign key reference)
CREATE TABLE admin_users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    event_type VARCHAR(100), -- bollywood, edm, live_music, hip_hop, etc.
    description TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    dj_artist VARCHAR(255),
    ticket_price DECIMAL(10,2) DEFAULT 0,
    max_capacity INTEGER,
    poster_image_url TEXT,
    status VARCHAR(20) DEFAULT 'active', -- active, cancelled, sold_out
    created_by INTEGER REFERENCES admin_users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery images table
CREATE TABLE gallery_images (
    id BIGSERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    caption TEXT,
    event_id INTEGER REFERENCES events(id),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id),
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    guest_phone VARCHAR(20),
    ticket_quantity INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_status VARCHAR(20) DEFAULT 'confirmed', -- confirmed, cancelled
    booking_reference VARCHAR(20) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_bookings_event_id ON bookings(event_id);
CREATE INDEX idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX idx_gallery_event_id ON gallery_images(event_id);