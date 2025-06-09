import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import GoogleIcon from '../Icons/GoogleIcon';
import '../../styles/Auth.css';
import '../../styles/Backgrounds.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Add auth-page class to body to prevent scrolling
    document.body.classList.add('auth-page');
    
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/dashboard');
      }
    });

    return () => {
      // Clean up - remove auth-page class when component unmounts
      document.body.classList.remove('auth-page');
      subscription?.unsubscribe();
    };
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.session) {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
    } catch (error) {
      setError(error.message);
      setGoogleLoading(false);
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
            <p className="auth-motto">Fitness is not a destination, it's a journey. Let's make it a journey together.</p>
            <button className="get-started-btn" onClick={() => navigate('/register')}>GET STARTED</button>
          </div>
          
          <div className="auth-form-card">
            <h2>Sign in</h2>
            <p className="auth-subtitle">Please enter your credentials to continue</p>
            
            <form onSubmit={handleLogin}>
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
                  placeholder="Enter your password"
                />
              </div>

              <div className="remember-forgot">
                <div className="checkbox-container">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <Link to="/reset-password" className="auth-link forgot-link">Forgot Password?</Link>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>

              <div className="auth-divider">
                <span>or</span>
              </div>

              <button 
                type="button" 
                className="google-auth-button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  'Connecting...'
                ) : (
                  <>
                    <GoogleIcon />
                    Sign in with Google
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 