import { supabase } from '../config/supabase';

// Add daily fitness data
export const addDailyFitnessData = async (data) => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }
    
    // Prepare data object with all fields
    const fitnessData = {
      user_id: user.id,
      date: data.date || new Date().toISOString().split('T')[0], // Default to today in YYYY-MM-DD format
      food: data.food,
      calories: data.calories,
      protein: data.protein,
      fat: data.fat,
      steps: data.steps,
      created_at: new Date().toISOString()
    };
    
    // Add carbs if it's included in the data
    if (data.carbs !== undefined) {
      fitnessData.carbs = data.carbs;
    }
    
    // Insert data into user_daily_logs
    const { data: result, error } = await supabase
      .from('user_daily_logs')
      .insert(fitnessData);
      
    if (error) throw error;
    
    return result;
  } catch (error) {
    console.error('Error adding fitness data:', error);
    throw error;
  }
};

// Get today's fitness data for current user
export const getTodaysFitnessData = async () => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Query data for today
    const { data, error } = await supabase
      .from('user_daily_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching fitness data:', error);
    throw error;
  }
};

// Get summary of today's fitness data (totals)
export const getTodaysFitnessSummary = async () => {
  try {
    const data = await getTodaysFitnessData();
    
    // If no data, return zeros
    if (!data || data.length === 0) {
      return {
        totalCalories: 0,
        totalCarbs: 0,
        totalProtein: 0,
        totalFat: 0,
        totalSteps: 0,
        foods: []
      };
    }
    
    // Calculate totals
    const summary = data.reduce((acc, entry) => {
      return {
        totalCalories: acc.totalCalories + (Number(entry.calories) || 0),
        totalCarbs: acc.totalCarbs + (Number(entry.carbs) || 0),
        totalProtein: acc.totalProtein + (Number(entry.protein) || 0),
        totalFat: acc.totalFat + (Number(entry.fat) || 0),
        totalSteps: acc.totalSteps + (Number(entry.steps) || 0),
        foods: [...acc.foods, entry.food].filter(Boolean)
      };
    }, {
      totalCalories: 0,
      totalCarbs: 0,
      totalProtein: 0,
      totalFat: 0,
      totalSteps: 0,
      foods: []
    });
    
    return summary;
  } catch (error) {
    console.error('Error calculating fitness summary:', error);
    throw error;
  }
};

// Get weekly steps data
export const getWeeklyStepsData = async () => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }
    
    // Calculate dates for the past week
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6); // Get data for last 7 days
    
    const startDate = weekStart.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];
    
    // Query data for the week
    const { data, error } = await supabase
      .from('user_daily_logs')
      .select('date, steps')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });
      
    if (error) throw error;
    
    // Create a map for each day of the week
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const stepsMap = {};
    
    // Initialize with zeros
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dayIndex = date.getDay();
      const dateStr = date.toISOString().split('T')[0];
      stepsMap[dateStr] = { day: daysOfWeek[dayIndex], steps: 0, date: dateStr };
    }
    
    // Fill in actual data
    data.forEach(entry => {
      if (stepsMap[entry.date]) {
        stepsMap[entry.date].steps += Number(entry.steps || 0);
      }
    });
    
    // Convert to array
    const stepsData = Object.values(stepsMap);
    
    return stepsData;
  } catch (error) {
    console.error('Error fetching weekly steps data:', error);
    // Return default data in case of error
    return [
      { day: 'M', steps: 0 },
      { day: 'T', steps: 0 },
      { day: 'W', steps: 0 },
      { day: 'T', steps: 0 },
      { day: 'F', steps: 0 },
      { day: 'S', steps: 0 },
      { day: 'S', steps: 0 }
    ];
  }
}; 