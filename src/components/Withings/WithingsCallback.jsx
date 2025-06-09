import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { exchangeCodeForToken } from '../../services/withingsService';
import '../../styles/Withings.css';

const WithingsCallback = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (!code) {
          setError('No authorization code received from Withings');
          return;
        }

        if (state !== 'withings_auth') {
          setError('Invalid state parameter');
          return;
        }

        await exchangeCodeForToken(code);
        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error('Error during Withings callback:', err);
        setError('Failed to connect Withings account. Please try again.');
      }
    };

    handleCallback();
  }, [location, navigate]);

  if (error) {
    return (
      <div className="withings-callback-container">
        <div className="withings-callback-error">
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button 
            className="withings-button"
            onClick={() => navigate('/dashboard')}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="withings-callback-container">
      <div className="withings-callback-loading">
        <div className="loading-spinner"></div>
        <p>Connecting your Withings account...</p>
      </div>
    </div>
  );
};

export default WithingsCallback; 