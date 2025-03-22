import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbar-styles.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          ZeroMile
          <span className="navbar-logo-icon">🌱</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </div>
        </div>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/analytics" 
              className={`nav-link ${isActive('/analytics') ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              Analytics
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/inventory" 
              className={`nav-link ${isActive('/inventory') ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              Inventory
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/routemanager" 
              className={`nav-link ${isActive('/routemanager') ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              Route Manager
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/chatbotz" 
              className={`nav-link ${isActive('/chatbotz') ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              Chatbot
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;