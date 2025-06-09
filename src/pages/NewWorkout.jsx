import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllWorkouts } from '../data/workoutData';
import '../styles/NewWorkoutPage.css';

const WorkoutPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = () => {
    const data = getAllWorkouts();
    setWorkouts(data);
    setLoading(false);
  };

  const categories = ['All', 'Strength', 'Cardio', 'Flexibility', 'HIIT'];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleWorkoutClick = (workoutId) => {
    navigate(`/dashboard/workout/${workoutId}`);
  };

  // Filter workouts based on selected category
  const filteredWorkouts = selectedCategory === 'All' 
    ? workouts 
    : workouts.filter(w => w.category === selectedCategory);

  return (
    <div className="workout-container">
      <div className="workout-content">
        <div className="workout-header">
          <h1>Workouts</h1>
        </div>
        
        <div className="category-nav">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div className="loading">Loading workouts...</div>
        ) : (
          <div className="workout-list">
            {filteredWorkouts.map(workout => (
              <div 
                key={workout.id} 
                className="workout-item"
                onClick={() => handleWorkoutClick(workout.id)}
              >
                <div className="workout-details">
                  <h2 className="workout-title">{workout.title}</h2>
                  <p className="workout-description">{workout.description}</p>
                  <div className="workout-meta">
                    <span className="workout-duration">⏱️ {workout.duration}</span>
                    <span className={`workout-level workout-level-${workout.difficulty.toLowerCase()}`}>
                      {workout.difficulty}
                    </span>
                  </div>
                </div>
                <div className="workout-category">{workout.category}</div>
              </div>
            ))}
          </div>
        )}
        
        <div className="quick-start-container">
          <h2 className="section-title">Quick Start</h2>
          <div className="quick-options">
            <button className="quick-option">
              <div className="option-icon">🎯</div>
              <div className="option-label">Custom Workout</div>
            </button>
            <button className="quick-option">
              <div className="option-icon">🔄</div>
              <div className="option-label">Last Workout</div>
            </button>
            <button className="quick-option">
              <div className="option-icon">🎲</div>
              <div className="option-label">Random Workout</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPage; 