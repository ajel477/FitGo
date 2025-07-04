-- Drop existing tables if they exist to allow re-running the script
DROP TABLE IF EXISTS exercise_completion_records;
DROP TABLE IF EXISTS fitness_routines;

-- Table for storing workout definitions
CREATE TABLE fitness_routines (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  category TEXT NOT NULL CHECK (category IN ('Strength', 'Cardio', 'Flexibility', 'HIIT')),
  instructions JSONB NOT NULL,
  videoUrl TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE fitness_routines ENABLE ROW LEVEL SECURITY;

-- Create policy for reading workouts (all authenticated users can read)
CREATE POLICY "Fitness routines are viewable by all authenticated users" 
  ON fitness_routines FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Table for logging user workout completions
CREATE TABLE exercise_completion_records (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  routine_id BIGINT NOT NULL REFERENCES fitness_routines(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  duration_seconds INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE exercise_completion_records ENABLE ROW LEVEL SECURITY;

-- Create policies for workout logs (users can only see their own logs)
CREATE POLICY "Users can view their own exercise records" 
  ON exercise_completion_records FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exercise records" 
  ON exercise_completion_records FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise records" 
  ON exercise_completion_records FOR UPDATE 
  USING (auth.uid() = user_id);

-- Example of how to insert sample data with detailed instructions
INSERT INTO fitness_routines (title, description, duration, difficulty, category, instructions, videoUrl) VALUES
(
  'Full Body Strength',
  'Complete circuit of push-ups, squats, and dumbbell exercises for total body conditioning.',
  '45 min',
  'Intermediate',
  'Strength',
  '[
    {
      "step": 1, 
      "description": "Warm up with 5 minutes of light cardio",
      "details": {
        "duration": "5 minutes",
        "form": "Start with a light jog in place, arm circles, and jumping jacks to increase heart rate gradually."
      }
    },
    {
      "step": 2, 
      "description": "Push-ups: 3 sets of 15 reps",
      "details": {
        "sets": "3",
        "reps": "15",
        "rest": "60 seconds between sets",
        "form": "Keep your body in a straight line from head to heels. Lower your chest to the ground, then push back up. Modify on knees if needed."
      }
    },
    {
      "step": 3, 
      "description": "Squats: 3 sets of 20 reps",
      "details": {
        "sets": "3",
        "reps": "20",
        "rest": "60 seconds between sets",
        "form": "Stand with feet shoulder-width apart. Lower your hips as if sitting in a chair, keeping knees in line with toes. Drive through heels to stand."
      }
    },
    {
      "step": 4, 
      "description": "Dumbbell rows: 3 sets of 12 reps each arm",
      "details": {
        "sets": "3",
        "reps": "12 per arm",
        "rest": "45 seconds between sets",
        "form": "Place one knee and hand on a bench, with other foot on the ground. Pull dumbbell to hip, keeping elbow close to body."
      }
    },
    {
      "step": 5, 
      "description": "Lunges: 3 sets of 10 reps each leg",
      "details": {
        "sets": "3",
        "reps": "10 per leg",
        "rest": "60 seconds between sets",
        "form": "Step forward with one leg, lowering hips until both knees are bent at 90 degrees. Front knee should be above ankle, not pushed forward past toes."
      }
    },
    {
      "step": 6, 
      "description": "Plank: 3 sets of 45 seconds",
      "details": {
        "sets": "3",
        "duration": "45 seconds",
        "rest": "30 seconds between sets",
        "form": "Support your weight on forearms and toes. Keep body in a straight line with core engaged. Avoid raising hips or sagging in the middle."
      }
    },
    {
      "step": 7, 
      "description": "Cool down with stretching for 5 minutes",
      "details": {
        "duration": "5 minutes",
        "form": "Gently stretch all major muscle groups used in the workout. Hold each stretch for 20-30 seconds without bouncing."
      }
    }
  ]',
  'https://www.youtube.com/embed/IODxDxX7oi4'
);

-- Create index on user_id in exercise_completion_records for better query performance
DROP INDEX IF EXISTS idx_exercise_records_user_id;
CREATE INDEX idx_exercise_records_user_id ON exercise_completion_records(user_id);

-- Create index on routine_id in exercise_completion_records for better query performance
DROP INDEX IF EXISTS idx_exercise_records_routine_id;
CREATE INDEX idx_exercise_records_routine_id ON exercise_completion_records(routine_id); 