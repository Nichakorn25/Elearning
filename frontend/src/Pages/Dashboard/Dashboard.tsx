import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Sidebar from '../Component/Sidebar/Sidebar';
import Header from '../Component/Header/Header'; // เรียกใช้ Header ที่แยกไว้

const Dashboard: React.FC = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible); // เปิด/ปิด Sidebar
  };


  return (
    <div className="dashboard">
      {/* Header Section */}
      <Header />

     {/* Sidebar */}
     <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />

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
