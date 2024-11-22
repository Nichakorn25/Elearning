import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar'; // Import Sidebar
import './Header.css';

interface HeaderProps {
  onMenuClick: () => void; // รับฟังก์ชัน onMenuClick เป็น prop
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

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

  const goToProfile = () => {
    closeDropdown();
    navigate('/profile');
  };

  const handleLogout = () => {
    console.log('Logging out...');
    closeDropdown();
    navigate('/');
  };

  return (
    <>
      <header className="dashboard-header">
        <div className="dashboardheader-left">
          <button className="dashboardmenu-button" onClick={toggleSidebar}>
            ☰
          </button>
          <h1>SUT e-Learning</h1>
        </div>

        <div className="dashboardheader-right">
          <div className="dashboarduser-info" onClick={toggleDropdown}>
            <span className="dashboarduser-id">B65xxxxx</span>
            <span className="dashboarduser-name">Username</span>
            <img
              src="https://via.placeholder.com/40"
              alt="User Avatar"
              className="dashboarduser-avatar"
            />
            <i className={`arrow ${isDropdownVisible ? 'down' : 'up'}`}></i>
          </div>

          {isDropdownVisible && (
            <div className="dashboarddropdown-menu">
              <button onClick={goToDashboard}>Dashboard</button>
              <button onClick={goToProfile}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>

      {/* Sidebar Component */}
      <Sidebar isVisible={isSidebarVisible} />
    </>
  );
};

export default Header;
