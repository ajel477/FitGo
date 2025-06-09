import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuthUrl, exchangeCodeForToken } from '../../services/withingsService';
import '../../styles/Withings.css';

const ConnectWithings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    
    if (code) {
      handleCallback(code);
    }
  }, [location]);

  const handleCallback = async (code) => {
    setLoading(true);
    setError('');
    
    try {
      await exchangeCodeForToken(code);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Failed to connect to Withings. Please try again.');
      console.error('Withings connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    setLoading(true);
    setError('');
    
    try {
      window.location.href = getAuthUrl();
    } catch (err) {
      setError('Failed to initiate Withings connection. Please try again.');
      console.error('Withings connection error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="withings-container">
      <div className="withings-card">
        <h2>Connect to Withings</h2>
        <p>
          Connect your Withings account to sync your health data with FitGo.
          This will allow us to track your progress and provide personalized recommendations.
        </p>
        
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading-spinner" />
        ) : (
          <button 
            className="withings-button"
            onClick={handleConnect}
            disabled={loading}
          >
            Connect Withings Account
          </button>
        )}
      </div>
    </div>
  );
};

export default ConnectWithings; 