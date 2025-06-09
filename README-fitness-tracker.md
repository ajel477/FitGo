# FitGo Fitness Tracker

This feature allows users to manually input their daily fitness data and view a summary of their progress.

## Features

- Log daily food intake, calories, protein, fat, and steps
- View a summary of today's fitness data
- Track your daily nutrition and activity goals
- Securely store data in Supabase

## Setup Instructions

### 1. Database Setup

Run the Supabase migration to create the necessary table:

```bash
npx supabase migration up
```

This will create the `user_daily_logs` table with the following schema:

- `id`: UUID (Primary Key)
- `user_id`: UUID (References auth.users)
- `date`: DATE 
- `food`: TEXT
- `calories`: INTEGER
- `protein`: DECIMAL
- `fat`: DECIMAL
- `steps`: INTEGER
- `created_at`: TIMESTAMP

### 2. Environment Variables

Ensure your Supabase environment variables are set in your `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage

1. Navigate to the Fitness Tracker page from the main navigation menu
2. Enter your food intake, calories, protein, fat, and steps in the form
3. Click "Save Data" to record your entry
4. View your daily summary in the cards below the form
5. Track your progress over time by consistently logging your data

## Implementation Details

The feature consists of:

- `FitnessForm.jsx`: Component for manual data entry
- `FitnessSummary.jsx`: Component for displaying daily summaries
- `FitnessTracker.jsx`: Main page component combining form and summary
- `fitnessService.js`: Service for interacting with the Supabase database
- `Fitness.css`: Styles for the fitness tracker components
- SQL migration for creating the database table with proper security policies

## Security

- Row Level Security (RLS) ensures users can only access their own data
- Input validation prevents invalid data from being submitted
- Supabase authentication integration provides secure user identification

## Future Enhancements

Potential future improvements include:

- Weekly and monthly summary views
- Progress charts and visualizations
- Customizable nutrition goals
- Integration with Withings and other fitness trackers for automatic data import
- Meal planning and recipe suggestions 