-- Create login_logs table
CREATE TABLE IF NOT EXISTS login_logs
(
    id
    UUID
    PRIMARY
    KEY
    DEFAULT
    uuid_generate_v4
(
),
    user_id UUID NOT NULL REFERENCES auth.users
(
    id
),
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
    );

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON login_logs(user_id);

