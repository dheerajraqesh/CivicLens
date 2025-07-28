import React from 'react';
import './NavBar.css';

const NavBar = ({ user, onLogout, onNav }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">CivicLens</div>
      <div className="navbar-links">
        <button onClick={() => onNav('profile')}>Profile</button>
        {user.type === 'citizen' ? (
          <button onClick={() => onNav('past')}>Past Complaints</button>
        ) : (
          <button onClick={() => onNav('solved')}>Solved Complaints</button>
        )}
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default NavBar;
