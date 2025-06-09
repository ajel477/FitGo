-- Add carbohydrates column to user_daily_logs table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'user_daily_logs'
        AND column_name = 'carbs'
    ) THEN
        ALTER TABLE user_daily_logs 
        ADD COLUMN carbs DECIMAL(10, 2) DEFAULT 0 CHECK (carbs >= 0);
    END IF;
END
$$; 