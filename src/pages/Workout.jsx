import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { getAllWorkouts } from '../data/workoutData';
import '../styles/NewWorkoutStyle.css';
import '../styles/Backgrounds.css';

const WorkoutCard = ({ workout, onClick }) => {
  // Add default handling for missing properties
  if (!workout) {
    console.error('WorkoutCard received undefined workout');
    return null;
  }
  
  return (
    <div className="workout-card" onClick={() => onClick(workout.id || 0)}>
      <h3 className="workout-title">{workout.title || 'Untitled Workout'}</h3>
      <p className="workout-description">{workout.description || 'No description available.'}</p>
      <div className="workout-footer">
        <div className="workout-time">
          <span className="workout-icon">⏱️</span>
          <span className="workout-duration">{workout.duration || '0'} min</span>
        </div>
        <span className={`workout-difficulty ${(workout.difficulty || '').toLowerCase()}`}>
          {workout.difficulty || 'Beginner'}
        </span>
      </div>
      <div className="workout-category-tag">
        {workout.category || 'Uncategorized'}
      </div>
    </div>
  );
};

function Workout() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUsingLocalData, setIsUsingLocalData] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Component mounted, loading workouts directly from local data');
    useLocalData();
  }, []);

  const categories = ['All', 'Strength', 'Cardio', 'Flexibility', 'HIIT'];

  const fetchWorkouts = async () => {
    console.log('Using local data instead of Supabase');
    useLocalData();
  };
  
  const useLocalData = () => {
    console.log('Using local workout data');
    
    // Get local workout data directly from our workout data file
    const localWorkouts = getAllWorkouts();
    
    console.log('Local workouts available:', localWorkouts.map(w => `${w.title} (${w.category})`));
    
    // Verify we have workouts for all categories
    const categoryCounts = {};
    
    categories.forEach(category => {
      if (category !== 'All') {
        const count = localWorkouts.filter(w => w.category === category).length;
        categoryCounts[category] = count;
        console.log(`Category ${category} has ${count} workouts`);
      }
    });
    
    setWorkouts(localWorkouts);
    setLoading(false);
    setIsUsingLocalData(true);
  };
  
  const syncToSupabase = async () => {
    if (!isUsingLocalData) {
      console.log('Already using Supabase data, no need to sync');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Syncing local data to Supabase...');
      
      // Clear existing workouts
      const { error: deleteError } = await supabase
        .from('fitness_routines')
        .delete()
        .neq('id', 0);
      
      if (deleteError) {
        throw deleteError;
      }
      
      // Insert local workouts to Supabase
      const workoutsToInsert = getAllWorkouts();
      const { error: insertError } = await supabase
        .from('fitness_routines')
        .insert(workoutsToInsert);
      
      if (insertError) {
        throw insertError;
      }
      
      console.log('Successfully synced workouts to Supabase');
      
      // Fetch the workouts back from Supabase to get their IDs
      const { data, error } = await supabase
        .from('fitness_routines')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      setWorkouts(data);
      setIsUsingLocalData(false);
    } catch (error) {
      console.error('Error syncing to Supabase:', error);
      alert('There was an error syncing to the database. Using local data instead.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleWorkoutClick = (workoutId) => {
    navigate(`/dashboard/workout/${workoutId}`);
  };

  const handleCategoryChange = (category) => {
    console.log(`Changing category from ${selectedCategory} to ${category}`);
    setSelectedCategory(category);
    
    // Log available workouts for this category
    const workoutsInCategory = workouts.filter(w => 
      category === 'All' ? true : w.category === category
    );
    
    console.log(`Category ${category} has ${workoutsInCategory.length} workouts:`, 
      workoutsInCategory.map(w => w.title));
  };

  // Filter workouts based on selected category
  const filteredWorkouts = selectedCategory === 'All' 
    ? workouts 
    : workouts.filter(w => w.category === selectedCategory);
  
  useEffect(() => {
    // This effect runs when workouts or selectedCategory changes
    console.log(`Currently showing ${filteredWorkouts.length} workouts for category: ${selectedCategory}`);
    if (filteredWorkouts.length === 0 && workouts.length > 0) {
      console.warn(`No workouts found for category: ${selectedCategory}`);
    }
  }, [filteredWorkouts.length, selectedCategory, workouts.length]);

  return (
    <div className="workout-page workout-background">
      <div className="content-container">
        <div className="workout-header">
          <h1 className="page-title">Workouts</h1>
        </div>

        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-spinner">Loading workouts...</div>
        ) : (
          <div className="workouts-container">
            <div className="workouts-grid">
              {filteredWorkouts.map((workout) => (
                <WorkoutCard 
                  key={workout.id} 
                  workout={workout} 
                  onClick={handleWorkoutClick}
                />
              ))}
            </div>
          </div>
        )}

        <div className="quick-start-section">
          <h3 className="section-title">Quick Start</h3>
          <div className="quick-start-grid">
            <button className="quick-start-card">
              <span className="quick-start-icon">🎯</span>
              <span className="quick-start-title">Custom Workout</span>
            </button>
            <button className="quick-start-card">
              <span className="quick-start-icon">🔄</span>
              <span className="quick-start-title">Last Workout</span>
            </button>
            <button className="quick-start-card">
              <span className="quick-start-icon">🎲</span>
              <span className="quick-start-title">Random Workout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Workout;


  