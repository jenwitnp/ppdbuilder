-- LINE Subscriptions Table
-- Stores LINE user IDs of people who want to receive contact notifications

CREATE TABLE IF NOT EXISTS line_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_user_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_line_user_id ON line_subscriptions(line_user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE line_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow reads for authenticated users
CREATE POLICY "Allow read for authenticated users" ON line_subscriptions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Allow inserts from service role (for backend)
CREATE POLICY "Allow insert for service role" ON line_subscriptions
  FOR INSERT WITH CHECK (true);
