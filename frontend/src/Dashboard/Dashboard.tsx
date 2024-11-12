import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <button className="menu-button">☰</button>
          <h1>SUT e-Learning</h1>
          <span className="language">English (en)</span>
        </div>
        <div className="header-right">
          <span className="user-id">B6525972</span>
          <span className="user-name">ณิชากร จันทร์ยุติ</span>
          <img src="https://via.placeholder.com/40" alt="User Avatar" className="user-avatar" />
        </div>
      </header>
      
      <div className="search-bar">
        <input type="text" placeholder="ค้นหารายวิชา (Search courses)" />
        <button className="search-button">🔍</button>
      </div>

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
