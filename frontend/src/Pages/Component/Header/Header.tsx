import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar"; // Import Sidebar
import "./Header.css";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  // Get user role and user data from localStorage
  const userRole = localStorage.getItem("role"); // RoleID: '1', '2', '3'
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Extract user data or set default values
  const username = user?.username || "N/A";
  const firstName = user?.FirstName || "N/A";
  const lastName = user?.LastName || "N/A";

  // Get profile picture URL from localStorage
  const profileImageUrl = localStorage.getItem('profilePicture') || 'https://via.placeholder.com/120';

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  const goToDashboard = () => {
    closeDropdown();
    navigate("/dashboard");
  };

  const goToProfile = () => {
    closeDropdown();
    navigate("/profile");
  };

  const goToAdmin = () => {
    closeDropdown();
    navigate("/admin"); // Navigate to the admin page
  };

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.clear(); // Clear all stored data on logout
    closeDropdown();
    navigate("/");
  };

  const handleTitleClick = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <header className="dashboard-header">
        <div className="dashboardheader-left">
          <button className="dashboardmenu-button" onClick={toggleSidebar}>
            ☰
          </button>
          <h1 onClick={handleTitleClick} style={{ cursor: "pointer" }}>
            SUT e-Learning
          </h1>
        </div>

        <div className="dashboardheader-right">
          <div className="dashboarduser-info" onClick={toggleDropdown}>
            <span className="dashboarduser-id">{username}</span>
            <span className="dashboarduser-name">{`${firstName} ${lastName}`}</span>
            <img
              src={profileImageUrl} // Use profile picture from localStorage
              alt="User Avatar"
              className="dashboarduser-avatar"
            />
            <i className={`arrow ${isDropdownVisible ? "down" : "up"}`}></i>
          </div>

          {isDropdownVisible && (
            <div className="dashboarddropdown-menu">
              <button onClick={goToDashboard}>Dashboard</button>
              <button onClick={goToProfile}>Profile</button>
              {userRole === "3" && <button onClick={goToAdmin}>Admin</button>}
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>

      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
    </>
  );
};

export default Header;
