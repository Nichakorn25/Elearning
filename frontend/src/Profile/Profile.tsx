import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  const goToDashboard = () => {
    closeDropdown();
    navigate('/dashboard');
  };

  const handleLogout = () => {
    closeDropdown();
    console.log('Logging out...');
    navigate('/');
  };
  
  return (
    <div className="profile-dashboard">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-left">
          <button className="menu-button">☰</button>
          <h1>SUT e-Learning</h1>
        </div>
        <div className="header-right">
          <div className="user-info" onClick={toggleDropdown}>
            <span className="user-id">B6525972</span>
            <span className="user-name">ณิชากร จันทร์ยุทา</span>
            <img
              src="https://via.placeholder.com/40"
              alt="User Avatar"
              className="user-avatar"
            />
          </div>
          {isDropdownVisible && (
            <div className="dropdown-menu">
              <button onClick={goToDashboard}>Dashboard</button>
              <button onClick={() => navigate('/profile')}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>

      {/* Profile Content */}
      <main className="profile-content">
        <h2 className="profile-title">My Profile</h2>
        <div className="profile-card">
          <img
            className="profile-avatar"
            src="https://via.placeholder.com/120"
            alt="User Avatar"
          />
          <div className="profile-details">
            <h3>ณิชากร จันทร์ยุทา</h3>
            <p>User ID: B6525972</p>
            <p>Email: nichakorn@example.com</p>
            <p>Faculty: Engineering</p>
            <p>Program: Computer Engineering</p>
          </div>
        </div>
        <div className="profile-actions">
          <button className="profile-button">Edit Profile</button>
          
        </div>
      </main>
    </div>
  );
};

export default Profile;
