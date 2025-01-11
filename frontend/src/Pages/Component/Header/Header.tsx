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
  const profileImageUrl =
    localStorage.getItem("profilePicture") || "https://via.placeholder.com/120";

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
      <header className="stddashboard-header">
        <div className="stddashboard-header-left">
          <button
            className="stddashboard-menu-button"
            onClick={toggleSidebar}
          >
            ☰
          </button>
          <h1
            onClick={handleTitleClick}
            style={{ cursor: "pointer"}}
          >
            SE e-Learning
          </h1>
        </div>

        <div className="stddashboard-header-right">
          {/* Notification Button */}
          <button className="stddashboard-notification-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="stddashboard-notification-icon"
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path
                fill="currentColor"
                d="M20 17h2v2H2v-2h2v-7a8 8 0 1 1 16 0v7zm-2 0v-7a6 6 0 1 0-12 0v7h12zm-9 4h6v2H9v-2z"
              ></path>
            </svg>
          </button>

          {/* User Info */}
          <div
            className="stddashboard-user-info"
            onClick={toggleDropdown}
          >
            <span className="stddashboard-user-id">{username}</span>
            <span className="stddashboard-user-name">{`${firstName} ${lastName}`}</span>
            <img
              src={profileImageUrl}
              // alt="User Avatar"
              className="stddashboard-user-avatar"
            />
            <i
              className={`stddashboard-arrow ${
                isDropdownVisible ? "down" : "up"
              }`}
            ></i>
          </div>

          {/* Dropdown Menu */}
          {isDropdownVisible && (
            <div className="stddashboard-dropdown-menu">
              <button onClick={goToDashboard}>Dashboard</button>
              <button onClick={goToProfile}>Profile</button>
              {userRole === "3" && (
                <button onClick={goToAdmin}>Admin</button>
              )}
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>

      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
    </>
  );
};

export default Header;
