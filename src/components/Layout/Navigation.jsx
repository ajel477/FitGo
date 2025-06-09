import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import '../../styles/Navigation.css';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="logo-container">
          <svg className="app-logo" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 3C8.83 3 3 8.83 3 16C3 23.17 8.83 29 16 29C23.17 29 29 23.17 29 16C29 8.83 23.17 3 16 3ZM16 7C18.03 7 19.69 8.66 19.69 10.69C19.69 12.72 18.03 14.38 16 14.38C13.97 14.38 12.31 12.72 12.31 10.69C12.31 8.66 13.97 7 16 7ZM16 25.2C13.1 25.2 10.52 23.92 8.87 21.86C8.92 18.93 14.01 17.31 16 17.31C17.99 17.31 23.08 18.93 23.13 21.86C21.48 23.92 18.9 25.2 16 25.2Z" fill="white"/>
          </svg>
          <Link to="/dashboard" className="app-name">FitGo</Link>
        </div>
        
        <div className="nav-links">
          <Link to="/dashboard" className={`nav-link ${isActive('dashboard') && !isActive('workout') && !isActive('profile') && !isActive('fitness-tracker') && !isActive('connect-withings') ? 'active' : ''}`}>
            Dashboard
          </Link>
          <Link to="/dashboard/workout" className={`nav-link ${isActive('workout') ? 'active' : ''}`}>
            Workouts
          </Link>
          <Link to="/dashboard/fitness-tracker" className={`nav-link ${isActive('fitness-tracker') ? 'active' : ''}`}>
            Nutrition Log
          </Link>
          <Link to="/dashboard/profile" className={`nav-link ${isActive('profile') ? 'active' : ''}`}>
            Profile
          </Link>
        </div>
        
        <div className="nav-actions">
          <button className="nav-icon-button" title="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
            </svg>
          </button>
          <button className="nav-icon-button" title="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="currentColor"/>
            </svg>
          </button>
          <button className="nav-icon-button" onClick={handleLogout} title="Logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
            </svg>
          </button>
          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav active">
          <Link 
            to="/dashboard" 
            className="nav-link" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/dashboard/workout" 
            className="nav-link" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Workouts
          </Link>
          <Link 
            to="/dashboard/fitness-tracker" 
            className="nav-link" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Nutrition Log
          </Link>
          <Link 
            to="/dashboard/profile" 
            className="nav-link" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Profile
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navigation; 