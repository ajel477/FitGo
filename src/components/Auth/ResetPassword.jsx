import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import '../../styles/Auth.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      setMessage('Password reset link has been sent to your email!');
      setEmail('');
    } catch (error) {
      setError(error.message || 'An error occurred during password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-sidebar">
          <div className="auth-sidebar-circles">
            <div className="auth-sidebar-circle"></div>
            <div className="auth-sidebar-circle"></div>
          </div>
          <div className="auth-sidebar-content">
            <div className="auth-logo">FitGo</div>
            <h1 className="auth-welcome">Reset Password</h1>
            <p className="auth-tagline">We'll send you a link to reset your password and get you back on track with your fitness journey.</p>
          </div>
        </div>
        
        <div className="auth-form-container">
          <h2>Reset Password</h2>
          <p className="auth-subtitle">Enter your email address to receive a password reset link</p>
          
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="auth-links">
              <Link to="/login" className="auth-link">Back to Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 