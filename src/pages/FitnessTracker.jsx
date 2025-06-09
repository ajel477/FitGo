import React, { useState } from 'react';
import FitnessForm from '../components/Fitness/FitnessForm';
import FitnessSummary from '../components/Fitness/FitnessSummary';
import '../styles/Fitness.css';

const FitnessTracker = () => {
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  const handleDataAdded = () => {
    // Increment counter to trigger refresh of summary
    setRefreshCounter(prev => prev + 1);
  };
  
  return (
    <div className="nutrition-log-page">
      <div className="nutrition-header">
        <h1 className="nutrition-title">Nutrition Log</h1>
        <p className="nutrition-subtitle">Track your daily nutrition and activity</p>
      </div>
      
      <div className="fitness-container">
        <FitnessForm onDataAdded={handleDataAdded} />
        <FitnessSummary refreshTrigger={refreshCounter} />
      </div>
    </div>
  );
};

export default FitnessTracker; 