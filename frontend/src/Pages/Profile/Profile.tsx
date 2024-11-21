import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import Sidebar from '../Component/Sidebar/Sidebar';
import Header from '../Component/Header/Header';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="profile-dashboard">
      {/* Header Section */}
      <Header />
      
      {/* Sidebar Section */}
      <Sidebar isVisible={isSidebarVisible} />

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
