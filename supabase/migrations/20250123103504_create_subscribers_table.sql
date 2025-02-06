-- Drop the table if it already exists
DROP TABLE IF EXISTS Subscribers;

-- Create the Subscribers table
CREATE TABLE Subscribers (
    id SERIAL PRIMARY KEY, -- Unique ID, auto-incremented
    user_email VARCHAR(255) UNIQUE NOT NULL, -- Unique email of the user, mandatory
    themes TEXT[] DEFAULT '{}', -- List of strings, default is an empty array
    unwanted_themes TEXT[] DEFAULT '{}', -- List of strings, default is an empty array
    sources TEXT[] DEFAULT '{}', -- List of strings, default is an empty array
    unwanted_sources TEXT[] DEFAULT '{}', -- List of strings, default is an empty array
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Date of subscription, default: now
    next_newsletter TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Next newsletter send date (defaults to now)
    periodicity INTEGER DEFAULT 604800 -- Interval between newsletters in seconds (default: 604800 seconds = 7 days)
);

INSERT INTO Subscribers (id, user_email)
VALUES (0, 'test@mail.net');
