import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Auth.css';
import '../../styles/Backgrounds.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Add auth-page class to body to prevent scrolling
    document.body.classList.add('auth-page');
    
    return () => {
      // Clean up - remove auth-page class when component unmounts
      document.body.classList.remove('auth-page');
    };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        navigate('/login', { replace: true });
        alert('Registration successful! Please check your email for verification.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container auth-background" style={{
      backgroundImage: 'url("https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="content-container">
        <div className="auth-layout">
          <div className="auth-intro">
            <h1 className="auth-title">FITGO</h1>
            <p className="auth-motto">Begin your fitness journey today and achieve your goals with professional guidance.</p>
            <button className="get-started-btn" onClick={() => navigate('/login')}>ALREADY A MEMBER</button>
          </div>
          
          <div className="auth-form-card">
            <h2>Create Account</h2>
            <p className="auth-subtitle">Sign up to start your fitness journey</p>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleRegister}>
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
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Choose a password"
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your password"
                  minLength={6}
                />
              </div>

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
              
              <div className="auth-divider">
                <span>or</span>
              </div>
              
              <div className="login-link-container">
                <span>Already have an account?</span>
                <Link to="/login" className="auth-link">Sign in</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 