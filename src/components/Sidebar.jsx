import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';  // optional if you want to keep sidebar styles separate

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo"></div>
      <ul className="menu">
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/goals">Goal Tracker</Link>
        </li>
        <li>
          <Link to="/accountability">
            <i className="fas fa-user-friends"></i> 
            <span>Friend Circle</span>
          </Link>
        </li>

        {/* Other links can stay here */}
        <li className="logout">
          <Link to="/">Logout</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
