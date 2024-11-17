import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
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
    console.log('Logging out...');
    closeDropdown();
    navigate('/'); // เปลี่ยนเส้นทางไปหน้าแรก
  };

  const goToProfile = () => {
    closeDropdown();
    navigate('/profile'); // เปลี่ยนเส้นทางไปหน้าโปรไฟล์
  };
  const goToBuySheet = () => {
    closeDropdown();
    navigate('/Buysheet'); // เปลี่ยนเส้นทางไปหน้าโปรไฟล์
  };

  return (
    <div className="dashboard">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="dashboardheader-left">
          <button className="dashboardmenu-button">☰</button>
          <h1>SUT e-Learning</h1>
          <span className="dashboardlanguage">English (en)</span>
        </div>
        <div className="dashboardheader-right">
          {/* คลิก User ID, Name หรือ Avatar เพื่อเปิด dropdown */}
          <div className="dashboarduser-info" onClick={toggleDropdown}>
            <span className="dashboarduser-id">B65xxxxx</span>
            <span className="dashboarduser-name">Username</span>
            <img
              src="https://via.placeholder.com/40"
              alt="User Avatar"
              className="dashboarduser-avatar"
            />
          </div>

          {/* Dropdown Menu */}
          {isDropdownVisible && (
            <div className="dashboarddropdown-menu">
              <button onClick={goToDashboard}>Dashboard</button>
              <button onClick={goToProfile}>Profile</button>
              <button onClick={goToBuySheet}>BuySheet</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>

      {/* Search Bar */}
      <div className="dashboardsearch-bar">
        <input type="text" placeholder="ค้นหารายวิชา (Search courses)" />
        <button className="dashboardsearch-button">🔍</button>
      </div>

      {/* Course Overview */}
      <div className="course-overview">
        <h2>Course overview</h2>
        <div className="course-list">
          <div className="course-card">
            <h3>ENG23 3054 Operating Systems</h3>
            <p>Asst. Dr. Prof...</p>
          </div>
          <div className="course-card">
            <h3>ENG23 4041 CYBER SECURITY FUNDAMENTALS</h3>
            <p>02/2567 ...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
