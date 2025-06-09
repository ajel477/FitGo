-- Add carbohydrates column to user_daily_logs table
ALTER TABLE user_daily_logs 
ADD COLUMN carbs DECIMAL(10, 2) DEFAULT 0 CHECK (carbs >= 0); 