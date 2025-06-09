import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import '../styles/WorkoutDetail.css';

const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedInstructions, setExpandedInstructions] = useState(false);
  
  useEffect(() => {
    fetchWorkoutDetails();
  }, [id]);
  
  const fetchWorkoutDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!id) {
        throw new Error('Workout ID is missing');
      }
      
      const { data, error: supabaseError } = await supabase
        .from('fitness_routines')
        .select('*')
        .eq('id', id)
        .single();
        
      if (supabaseError) {
        throw supabaseError;
      }
      
      if (!data) {
        throw new Error('Workout not found');
      }
      
      // Make sure instructions exist and are valid
      if (!data.instructions || !Array.isArray(data.instructions) || data.instructions.length === 0) {
        data.instructions = [{ step: 1, description: "No instructions provided for this workout." }];
      }
      
      setWorkout(data);
    } catch (error) {
      console.error('Error fetching workout details:', error);
      setError(error.message || 'Failed to load workout details');
    } finally {
      setLoading(false);
    }
  };
  
  const handleStartWorkout = () => {
    setWorkoutStarted(true);
    setCurrentStep(1);
    // Record workout start in exercise_completion_records if you want to track this
  };
  
  const handleNextStep = () => {
    if (currentStep < workout.instructions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      completeWorkout();
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const completeWorkout = async () => {
    try {
      setWorkoutCompleted(true);
      // Log workout completion to Supabase
      const user = await supabase.auth.getUser();
      
      if (!user.data?.user?.id) {
        console.error('User not authenticated');
        return;
      }
      
      const { error: logError } = await supabase
        .from('exercise_completion_records')
        .insert({
          user_id: user.data.user.id,
          routine_id: id,
          completed_at: new Date().toISOString(),
        });
        
      if (logError) {
        throw logError;
      }
    } catch (error) {
      console.error('Error logging workout completion:', error);
      // Show a toast or notification here instead of failing the entire completion flow
    }
  };

  const toggleInstructions = () => {
    setExpandedInstructions(!expandedInstructions);
  };

  const getInstructionDetails = (instruction) => {
    if (!instruction.details) return null;
    
    return (
      <div className="instruction-details">
        {instruction.details.sets && (
          <div className="detail-item">
            <span className="detail-label">Sets:</span>
            <span className="detail-value">{instruction.details.sets}</span>
          </div>
        )}
        {instruction.details.reps && (
          <div className="detail-item">
            <span className="detail-label">Reps:</span>
            <span className="detail-value">{instruction.details.reps}</span>
          </div>
        )}
        {instruction.details.duration && (
          <div className="detail-item">
            <span className="detail-label">Duration:</span>
            <span className="detail-value">{instruction.details.duration}</span>
          </div>
        )}
        {instruction.details.rest && (
          <div className="detail-item">
            <span className="detail-label">Rest:</span>
            <span className="detail-value">{instruction.details.rest}</span>
          </div>
        )}
        {instruction.details.form && (
          <div className="form-guidance">
            <span className="form-label">Form guidance:</span>
            <p className="form-text">{instruction.details.form}</p>
          </div>
        )}
      </div>
    );
  };
  
  if (loading) {
    return <div className="loading-container">Loading workout details...</div>;
  }
  
  if (error) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button 
          className="action-button primary" 
          onClick={() => navigate('/dashboard/workout')}
        >
          Go Back to Workouts
        </button>
      </div>
    );
  }
  
  if (!workout) {
    return (
      <div className="error-container">
        <h2>Workout not found</h2>
        <p>The workout you're looking for doesn't exist or has been removed.</p>
        <button 
          className="action-button primary" 
          onClick={() => navigate('/dashboard/workout')}
        >
          Browse Workouts
        </button>
      </div>
    );
  }
  
  const currentInstruction = workoutStarted && !workoutCompleted && workout.instructions 
    ? workout.instructions.find(instruction => instruction.step === currentStep) || workout.instructions[0]
    : null;
  
  // Add rich details to instructions if they don't exist
  const enhancedInstructions = workout.instructions.map(instruction => {
    // If instruction already has details, return it as is
    if (instruction.details) return instruction;
    
    // Create default details based on instruction text
    const details = {};
    const description = instruction.description.toLowerCase();
    
    // Extract potential sets/reps information from the description
    if (description.includes('set') || description.includes('rep')) {
      // Look for X sets of Y reps pattern
      const setsMatch = description.match(/(\d+)\s*sets?/i);
      const repsMatch = description.match(/(\d+)\s*reps?/i);
      
      if (setsMatch) details.sets = setsMatch[1];
      if (repsMatch) details.reps = repsMatch[1];
    }
    
    // Extract duration information
    if (description.includes('second') || description.includes('minute')) {
      const timeMatch = description.match(/(\d+)\s*(second|minute|min|sec)/i);
      if (timeMatch) details.duration = `${timeMatch[1]} ${timeMatch[2]}s`;
    }
    
    // Add basic form guidance for common exercises
    if (description.includes('push-up')) {
      details.form = "Keep your body in a straight line from head to heels. Lower your chest to the ground, then push back up.";
    } else if (description.includes('squat')) {
      details.form = "Stand with feet shoulder-width apart. Lower your hips as if sitting in a chair, keeping knees in line with toes.";
    } else if (description.includes('plank')) {
      details.form = "Support your weight on forearms and toes. Keep body in a straight line with core engaged.";
    }
    
    return {...instruction, details};
  });
  
  return (
    <div className="workout-detail-container">
      <button className="back-button" onClick={() => navigate('/dashboard/workout')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
        </svg>
        Back to Workouts
      </button>
      
      <div className="workout-detail-header">
        <h1>{workout.title}</h1>
        <div className="workout-meta">
          <span className="workout-duration">⏱️ {workout.duration}</span>
          <span className={`workout-difficulty ${workout.difficulty.toLowerCase()}`}>
            {workout.difficulty}
          </span>
          <span className="workout-category">{workout.category}</span>
        </div>
        <p className="workout-description">{workout.description}</p>
      </div>
      
      {!workoutStarted && !workoutCompleted && (
        <div className="workout-overview">
          <div className="workout-instructions-overview">
            <div className="instructions-header">
              <h2>Workout Routine</h2>
              <button className="toggle-button" onClick={toggleInstructions}>
                {expandedInstructions ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            <ul className={`instructions-list ${expandedInstructions ? 'expanded' : ''}`}>
              {enhancedInstructions.map((instruction) => (
                <li key={instruction.step}>
                  <div className="instruction-main">
                    <span className="step-number">{instruction.step}</span>
                    <span className="step-text">{instruction.description}</span>
                  </div>
                  {expandedInstructions && getInstructionDetails(instruction)}
                </li>
              ))}
            </ul>
            <button className="start-button" onClick={handleStartWorkout}>
              Start Workout
            </button>
          </div>
        </div>
      )}
      
      {workoutStarted && !workoutCompleted && currentInstruction && (
        <div className="workout-in-progress">
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${(currentStep / workout.instructions.length) * 100}%` }}
            ></div>
          </div>
          
          <div className="current-step">
            <div className="step-header">
              <span className="step-label">STEP {currentStep} OF {workout.instructions.length}</span>
              <h2>{currentInstruction.description}</h2>
            </div>
            
            {currentInstruction.details && (
              <div className="current-instruction-details">
                {getInstructionDetails(currentInstruction)}
              </div>
            )}
            
            <div className="workout-actions">
              <button 
                className="action-button secondary" 
                onClick={handlePreviousStep}
                disabled={currentStep === 1}
              >
                Previous
              </button>
              <button 
                className="action-button primary" 
                onClick={handleNextStep}
              >
                {currentStep === workout.instructions.length ? 'Complete Workout' : 'Next Step'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {workoutCompleted && (
        <div className="workout-completed">
          <div className="completion-message">
            <h2>🎉 Workout Completed! 🎉</h2>
            <p>Great job! You've completed the {workout.title} workout.</p>
            
            <div className="completion-actions">
              <button className="action-button restart" onClick={handleStartWorkout}>
                Do it Again
              </button>
              <button 
                className="action-button browse" 
                onClick={() => navigate('/dashboard/workout')}
              >
                Browse More Workouts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutDetail; 