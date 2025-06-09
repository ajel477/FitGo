import React, { useState, useEffect } from 'react';
import { getTodaysFitnessSummary } from '../../services/fitnessService';
import '../../styles/Fitness.css';

const FitnessSummary = ({ refreshTrigger }) => {
  const [summary, setSummary] = useState({
    totalCalories: 0,
    totalCarbs: 0,
    totalProtein: 0,
    totalFat: 0,
    totalSteps: 0,
    foods: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError('');
        
        const data = await getTodaysFitnessSummary();
        setSummary(data);
      } catch (err) {
        console.error('Error fetching fitness summary:', err);
        setError('Failed to load today\'s fitness data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSummary();
  }, [refreshTrigger]); // Refresh when triggered by parent
  
  if (loading) {
    return <div className="loading-spinner">Loading nutrition data...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  const formatNumber = (num) => {
    return Math.round(num).toLocaleString();
  };
  
  return (
    <div className="fitness-summary-container">
      <h2 className="fitness-summary-title">Today's Nutrition Summary</h2>
      
      <div className="fitness-cards">
        <div className="fitness-card">
          <div className="fitness-card-icon">🔥</div>
          <div className="fitness-card-value">{formatNumber(summary.totalCalories)}</div>
          <div className="fitness-card-label">Calories</div>
        </div>
        
        <div className="fitness-card">
          <div className="fitness-card-icon">🍚</div>
          <div className="fitness-card-value">{formatNumber(summary.totalCarbs)}g</div>
          <div className="fitness-card-label">Carbs</div>
        </div>
        
        <div className="fitness-card">
          <div className="fitness-card-icon">🍗</div>
          <div className="fitness-card-value">{formatNumber(summary.totalProtein)}g</div>
          <div className="fitness-card-label">Protein</div>
        </div>
        
        <div className="fitness-card">
          <div className="fitness-card-icon">🥑</div>
          <div className="fitness-card-value">{formatNumber(summary.totalFat)}g</div>
          <div className="fitness-card-label">Fat</div>
        </div>
      </div>
      
      <div className="fitness-card steps-card">
        <div className="fitness-card-icon steps-icon">👣</div>
        <div className="steps-content">
          <div className="fitness-card-value">{formatNumber(summary.totalSteps)}</div>
          <div className="fitness-card-label">Steps</div>
        </div>
      </div>
      
      {summary.foods.length > 0 && (
        <div className="foods-list">
          <h3 className="foods-list-title">Today's Food Log</h3>
          <ul>
            {summary.foods.map((food, index) => (
              <li key={index}>{food}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FitnessSummary; 