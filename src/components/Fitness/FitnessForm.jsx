import React, { useState } from 'react';
import { addDailyFitnessData } from '../../services/fitnessService';
import '../../styles/Fitness.css';

const FitnessForm = ({ onDataAdded }) => {
  const [formData, setFormData] = useState({
    food: '',
    calories: '',
    carbs: '',
    protein: '',
    fat: '',
    steps: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Validate form data
      if (!formData.food.trim()) {
        throw new Error('Please enter what you ate');
      }
      
      if (isNaN(formData.calories) || formData.calories <= 0) {
        throw new Error('Please enter a valid calorie amount');
      }
      
      if (isNaN(formData.carbs) || formData.carbs < 0) {
        throw new Error('Please enter a valid carbohydrate amount');
      }
      
      if (isNaN(formData.protein) || formData.protein < 0) {
        throw new Error('Please enter a valid protein amount');
      }
      
      if (isNaN(formData.fat) || formData.fat < 0) {
        throw new Error('Please enter a valid fat amount');
      }
      
      if (isNaN(formData.steps) || formData.steps < 0) {
        throw new Error('Please enter a valid step count');
      }
      
      // Submit data to Supabase
      await addDailyFitnessData({
        food: formData.food,
        calories: Number(formData.calories),
        carbs: Number(formData.carbs),
        protein: Number(formData.protein),
        fat: Number(formData.fat),
        steps: Number(formData.steps)
      });
      
      // Reset form
      setFormData({
        food: '',
        calories: '',
        carbs: '',
        protein: '',
        fat: '',
        steps: ''
      });
      
      setSuccess('Data added successfully!');
      
      // Notify parent component
      if (onDataAdded) {
        onDataAdded();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fitness-form-container">
      <h2 className="fitness-form-title">Log Your Nutrition & Activity</h2>
      
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form className="fitness-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="food">What did you eat?</label>
          <textarea
            id="food"
            name="food"
            value={formData.food}
            onChange={handleChange}
            placeholder="E.g., Breakfast: Oatmeal with berries, Lunch: Grilled chicken salad"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="calories">Calories</label>
            <input
              type="number"
              id="calories"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              placeholder="E.g., 500"
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="steps">Steps</label>
            <input
              type="number"
              id="steps"
              name="steps"
              value={formData.steps}
              onChange={handleChange}
              placeholder="E.g., 8000"
              min="0"
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="carbs">Carbohydrates (g)</label>
            <input
              type="number"
              id="carbs"
              name="carbs"
              value={formData.carbs}
              onChange={handleChange}
              placeholder="E.g., 60"
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="protein">Protein (g)</label>
            <input
              type="number"
              id="protein"
              name="protein"
              value={formData.protein}
              onChange={handleChange}
              placeholder="E.g., 30"
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="fat">Fat (g)</label>
            <input
              type="number"
              id="fat"
              name="fat"
              value={formData.fat}
              onChange={handleChange}
              placeholder="E.g., 15"
              min="0"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Entry'}
        </button>
      </form>
    </div>
  );
};

export default FitnessForm; 