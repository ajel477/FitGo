import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMeasurements, getAuthUrl } from '../services/withingsService.js';
import { getTodaysFitnessSummary, getWeeklyStepsData } from '../services/fitnessService.js';
import { supabase } from '../config/supabase.js';
import '../styles/Dashboard.css';

// Progress Circle Component
const ProgressCircle = ({ value, max, percentage, label, type }) => {
  const strokeDashoffset = 283 - (283 * percentage) / 100;
  
  return (
    <div className={`progress-circle ${type}`}>
      <svg viewBox="0 0 100 100">
        <circle className="bg" cx="50" cy="50" r="45" />
        <circle 
          className="progress" 
          cx="50" 
          cy="50" 
          r="45" 
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="progress-circle-content">
        <p className="progress-circle-value">{value}</p>
        <p className="progress-circle-label">{label}</p>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon }) => (
  <div className="stat-card">
    <div className="stat-content">
      <p className="stat-title">{title}</p>
      <h3 className="stat-value">{value}</h3>
      <div className="stat-icon">{icon}</div>
    </div>
  </div>
);

// Bar Chart Component
const StepsBarChart = ({ data }) => {
  const today = new Date().getDay();
  const maxSteps = Math.max(...data.map(item => item.steps), 10000);

  return (
    <div className="bar-chart">
      {data.map((item, index) => {
        const heightPercentage = Math.max(5, Math.round((item.steps / maxSteps) * 100));
        return (
          <div key={index} className="bar-container">
            <div className="step-label">{item.steps.toLocaleString()}</div>
            <div 
              className={`bar ${index === today ? 'active' : ''}`} 
              style={{ height: `${heightPercentage}%` }}
            ></div>
            <div className="bar-day">{item.day}</div>
          </div>
        );
      })}
    </div>
  );
};

const Dashboard = () => {
  const [measurements, setMeasurements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [needsConnection, setNeedsConnection] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('daily');
  const [fitnessSummary, setFitnessSummary] = useState({
    totalCalories: 0,
    totalCarbs: 0,
    totalProtein: 0,
    totalFat: 0,
    totalSteps: 0,
    foods: []
  });
  const [nutritionData, setNutritionData] = useState({
    carbs: { value: 0, percentage: 0 },
    fat: { value: 0, percentage: 0 },
    protein: { value: 0, percentage: 0 }
  });
  const [stepsData, setStepsData] = useState([
    { day: 'M', steps: 0 },
    { day: 'T', steps: 0 },
    { day: 'W', steps: 0 },
    { day: 'T', steps: 0 },
    { day: 'F', steps: 0 },
    { day: 'S', steps: 0 },
    { day: 'S', steps: 0 }
  ]);
  const [weeklyStepsTotal, setWeeklyStepsTotal] = useState(0);
  const [stepsLoading, setStepsLoading] = useState(true);
  const navigate = useNavigate();

  // Nutrition goals
  const CALORIE_GOAL = 2000;
  const PROTEIN_GOAL = 150;
  const FAT_GOAL = 70;
  const CARBS_GOAL = 250;
  
  // Total steps for the week
  useEffect(() => {
    setWeeklyStepsTotal(stepsData.reduce((total, day) => total + day.steps, 0));
  }, [stepsData]);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          console.error('Auth error:', error);
          navigate('/login');
          return;
        }
        setUser(user);
      } catch (err) {
        console.error('Auth check failed:', err);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchFitnessData = async () => {
      if (!user) return;

      try {
        const summary = await getTodaysFitnessSummary();
        setFitnessSummary(summary);

        // Calculate percentages for nutrition chart using actual carbs data
        const totalGrams = (summary.totalCarbs || 0) + (summary.totalProtein || 0) + (summary.totalFat || 0);
        
        if (totalGrams > 0) {
          setNutritionData({
            carbs: { 
              value: Math.round(summary.totalCarbs), 
              percentage: Math.round((summary.totalCarbs / totalGrams) * 100) 
            },
            fat: { 
              value: Math.round(summary.totalFat), 
              percentage: Math.round((summary.totalFat / totalGrams) * 100) 
            },
            protein: { 
              value: Math.round(summary.totalProtein), 
              percentage: Math.round((summary.totalProtein / totalGrams) * 100) 
            }
          });
        }
      } catch (err) {
        console.error('Error fetching fitness data:', err);
      }
    };

    fetchFitnessData();
  }, [user]);

  useEffect(() => {
    const fetchStepsData = async () => {
      if (!user) return;
      
      setStepsLoading(true);
      try {
        const data = await getWeeklyStepsData();
        setStepsData(data);
      } catch (err) {
        console.error('Error fetching steps data:', err);
      } finally {
        setStepsLoading(false);
      }
    };
    
    fetchStepsData();
  }, [user]);

  useEffect(() => {
    const fetchMeasurements = async () => {
      if (!user) return; // Don't fetch if not authenticated

      try {
        console.log('Fetching measurements...');
        setLoading(true);
        setError('');
        setNeedsConnection(false);
        const data = await getMeasurements();
        console.log('Measurements data:', data);
        setMeasurements(data);
      } catch (err) {
        console.error("Failed to fetch Withings measurements:", err);
        if (err.message?.includes('No Withings token found') || 
            err.status === 404 || 
            err.message?.includes('does not exist')) {
          console.log('Setting needsConnection to true');
          setNeedsConnection(true);
          setError('Please connect your Withings account to see your health data.');
        } else {
          setError('Could not load Withings measurements. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMeasurements();
    }
  }, [user]);

  const handleConnectWithings = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    console.log('Connecting to Withings...');
    const authUrl = getAuthUrl();
    console.log('Redirecting to:', authUrl);
    window.location.href = authUrl;
  };

  if (!user) {
    return <div className="loading-spinner" />;
  }

  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  // Calculate percentages for progress circles
  const caloriesPercentage = Math.min(100, Math.round((fitnessSummary.totalCalories / CALORIE_GOAL) * 100));
  const proteinPercentage = Math.min(100, Math.round((fitnessSummary.totalProtein / PROTEIN_GOAL) * 100));
  const fatPercentage = Math.min(100, Math.round((fitnessSummary.totalFat / FAT_GOAL) * 100));
  const carbsPercentage = Math.min(100, Math.round((fitnessSummary.totalCarbs / CARBS_GOAL) * 100));
  
  // Calculate remaining calories
  const remainingCalories = Math.max(0, CALORIE_GOAL - fitnessSummary.totalCalories);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Today</h1>
          <div className="dashboard-date">{formatDate()}</div>
        </div>
        <div className="actions">
          <Link to="/dashboard/fitness-tracker" className="dashboard-action-button" title="Add Fitness Data">+</Link>
          <button className="dashboard-action-button">⋮</button>
        </div>
      </div>
      
      <div className="stats-grid">
        <StatCard title="Daily Steps" value={fitnessSummary.totalSteps.toLocaleString()} icon="👣" />
        <StatCard title="Workouts" value="3 / 5" icon="🏋️‍♂️" />
        <StatCard title="Water" value="6 cups" icon="💧" />
        <StatCard title="Sleep" value="7.5 hr" icon="😴" />
      </div>
      
      <div className="progress-circle-container">
        <ProgressCircle 
          value={fitnessSummary.totalCalories}
          max={CALORIE_GOAL}
          percentage={caloriesPercentage}
          label="calories"
          type="calories"
        />
        <ProgressCircle 
          value={`${Math.round(fitnessSummary.totalCarbs)}g`}
          max={CARBS_GOAL}
          percentage={carbsPercentage}
          label="carbs"
          type="carbs"
        />
        <ProgressCircle 
          value={`${Math.round(fitnessSummary.totalProtein)}g`}
          max={PROTEIN_GOAL}
          percentage={proteinPercentage}
          label="protein"
          type="protein"
        />
        <ProgressCircle 
          value={`${Math.round(fitnessSummary.totalFat)}g`}
          max={FAT_GOAL}
          percentage={fatPercentage}
          label="fat"
          type="fat"
        />
      </div>
      
      <div className="macro-dots">
        <div className="macro-dot calories"></div>
        <div className="macro-dot carbs"></div>
        <div className="macro-dot protein"></div>
        <div className="macro-dot fat"></div>
      </div>
      
      <div className="activity-chart-section">
        <div className="activity-header">
          <h3 className="activity-title">Steps</h3>
          <div className="activity-tabs">
            <button 
              className={`activity-tab ${activeTab === 'daily' ? 'active' : ''}`}
              onClick={() => setActiveTab('daily')}
            >
              Daily
            </button>
            <button 
              className={`activity-tab ${activeTab === 'weekly' ? 'active' : ''}`}
              onClick={() => setActiveTab('weekly')}
            >
              Weekly
            </button>
          </div>
        </div>
        
        <div className="steps-chart">
          {stepsLoading ? (
            <div className="loading-spinner" />
          ) : (
            <StepsBarChart data={stepsData} />
          )}
        </div>
        
        <div className="steps-summary">
          <div>
            <h3 className="steps-total">{weeklyStepsTotal.toLocaleString()}</h3>
            <p className="steps-label">steps this week</p>
          </div>
          <div className="step-trend">
            <Link to="/dashboard/fitness-tracker" className="add-steps-link">+ Add Steps</Link>
          </div>
        </div>
        
        <div className="goal-progress">
          <div className="goal-bar" style={{ width: `${Math.min(100, (weeklyStepsTotal / 50000) * 100)}%` }}></div>
        </div>
      </div>
      
      <div className="nutrition-section">
        <div className="nutrition-header">
          <h3 className="nutrition-title">Nutrition</h3>
        </div>
        
        <div className="nutrition-legend">
          <div className="legend-item">
            <div className="legend-color carbs"></div>
            <div className="legend-text">
              <span className="legend-label">Carbohydrates</span>
              <span className="legend-value">{nutritionData.carbs.percentage}%</span>
            </div>
          </div>
          <div className="legend-item">
            <div className="legend-color fat"></div>
            <div className="legend-text">
              <span className="legend-label">Fat</span>
              <span className="legend-value">{nutritionData.fat.percentage}%</span>
            </div>
          </div>
          <div className="legend-item">
            <div className="legend-color protein"></div>
            <div className="legend-text">
              <span className="legend-label">Protein</span>
              <span className="legend-value">{nutritionData.protein.percentage}%</span>
            </div>
          </div>
        </div>
        
        <div className="nutrition-summary">
          <div className="nutrition-summary-item">
            <p className="summary-value">{fitnessSummary.totalCalories.toLocaleString()}</p>
            <p className="summary-label">Consumed</p>
          </div>
          <div className="nutrition-summary-item">
            <p className="summary-value">{CALORIE_GOAL.toLocaleString()}</p>
            <p className="summary-label">Goal</p>
          </div>
          <div className="nutrition-summary-item">
            <p className="summary-value">{remainingCalories.toLocaleString()}</p>
            <p className="summary-label">Remaining</p>
          </div>
        </div>
      </div>
      
      <div className="withings-data-section">
        <h2>Withings Health Data</h2>
        {loading && <div className="loading-spinner" />}
        
        {needsConnection ? (
          <div className="connect-withings-prompt">
            <p>{error}</p>
            <button 
              className="withings-button"
              onClick={handleConnectWithings}
            >
              Connect Withings Account
            </button>
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : measurements ? (
          <div className="measurements-container">
            <p>Last Update: {new Date(measurements.updatetime * 1000).toLocaleString()}</p>
            <div className="measurements-grid">
              {measurements.measuregrps.map((group, index) => (
                <div key={group.grpid || index} className="measurement-card">
                  <h4>Measurements from {new Date(group.date * 1000).toLocaleString()}</h4>
                  <div className="measures-list">
                    {group.measures.map((measure, mIndex) => (
                      <div key={mIndex} className="measure-item">
                        <span className="measure-label">{getMeasureLabel(measure.type)}:</span>
                        <span className="measure-value">
                          {measure.value * Math.pow(10, measure.unit)} {getMeasureUnit(measure.type)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          !loading && <p>No measurement data available yet.</p>
        )}
      </div>
    </div>
  );
};

// Helper functions to interpret measure types (you might want to expand these)
const getMeasureLabel = (type) => {
  switch (type) {
    case 1: return 'Weight';
    case 4: return 'Height';
    case 5: return 'Fat Free Mass';
    case 6: return 'Fat Ratio';
    case 8: return 'Fat Mass Weight';
    case 9: return 'Diastolic Blood Pressure';
    case 10: return 'Systolic Blood Pressure';
    case 11: return 'Heart Pulse';
    // Add more cases based on Withings API documentation
    default: return `Type ${type}`;
  }
};

const getMeasureUnit = (type) => {
  switch (type) {
    case 1: case 5: case 8: return 'kg';
    case 4: return 'm';
    case 6: return '%';
    case 9: case 10: return 'mmHg';
    case 11: return 'bpm';
    default: return '';
  }
};

export default Dashboard;


  