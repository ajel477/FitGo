-- Create user_daily_logs table for tracking fitness data
CREATE TABLE IF NOT EXISTS user_daily_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  food TEXT,
  calories INTEGER NOT NULL CHECK (calories >= 0),
  protein DECIMAL(10, 2) NOT NULL CHECK (protein >= 0),
  fat DECIMAL(10, 2) NOT NULL CHECK (fat >= 0),
  steps INTEGER NOT NULL CHECK (steps >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  -- Create an index on user_id and date for faster queries
  CONSTRAINT user_daily_logs_user_id_date_idx UNIQUE (user_id, date, created_at)
);

-- Set up RLS (Row Level Security)
ALTER TABLE user_daily_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view only their own data
CREATE POLICY "Users can view their own logs" 
  ON user_daily_logs
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for users to insert only their own data
CREATE POLICY "Users can insert their own logs" 
  ON user_daily_logs
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update only their own data
CREATE POLICY "Users can update their own logs" 
  ON user_daily_logs
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy for users to delete only their own data
CREATE POLICY "Users can delete their own logs" 
  ON user_daily_logs
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries by date range
CREATE INDEX user_daily_logs_user_date_idx ON user_daily_logs (user_id, date); 