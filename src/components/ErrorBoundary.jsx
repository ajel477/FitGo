import React from 'react';
import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import '../styles/ErrorBoundary.css';

const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage;
  let errorStatus;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || error.data?.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'An unexpected error occurred';
  }

  const goHome = () => {
    navigate('/dashboard');
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="error-boundary-container">
      <div className="error-card">
        <div className="error-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#7b5be6"/>
          </svg>
        </div>
        <h1 className="error-title">
          {errorStatus ? `${errorStatus} Error` : 'Application Error'}
        </h1>
        <p className="error-message">{errorMessage || 'Something went wrong'}</p>
        <div className="error-actions">
          <button className="action-button" onClick={goBack}>
            Go Back
          </button>
          <button className="action-button primary" onClick={goHome}>
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary; 