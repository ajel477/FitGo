import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">Fitness Tracker</Link>
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/workout">Workout</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

