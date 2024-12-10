-- creation of the table subscribers
CREATE TABLE IF NOT EXISTS Subscribers (
    id SERIAL PRIMARY KEY, -- unique id, auto-incremented
    user_email VARCHAR(255) UNIQUE NOT NULL, -- unique email of the user, mandatory
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- date of subscription, default : nowaday
    unsubscribe_token VARCHAR(255) UNIQUE NOT NULL, -- token generated during subscription, unique
    is_unsubscribed BOOLEAN DEFAULT false
);
