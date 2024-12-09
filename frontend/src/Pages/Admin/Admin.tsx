import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import Sidebar from '../Component/Sidebar/Sidebar';
import Header from '../Component/Header/Header';

const Admin: React.FC = () => {
    const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const goToAnnouncement = () => {
    navigate('/Announcement'); // เปลี่ยนเส้นทางไปหน้าโปรไฟล์
  };

  return (
    <div className="admin-dashboard">
      <Header />

      {isSidebarVisible && <Sidebar isVisible={isSidebarVisible} />}

      <div className="admin-search-bar">
        <input type="text" placeholder="ค้นหารายวิชา (Search courses)" />
        <button className="admin-search-button" >🔍</button>
      </div>

      <div className="admin-overview">
        <h2>Course overview</h2>
        <div className="admin-course-list">
          <div className="admin-course-card">
            <h3>ENG23 3054 Operating Systems</h3>
            <p>Asst. Dr. Prof...</p>
          </div>
          <div className="admin-course-card" >
            <h3>ENG23 4041 CYBER SECURITY FUNDAMENTALS</h3>
            <p>02/2567 ...</p>
          </div>
        </div>
      </div>
      <button onClick={goToAnnouncement}>Announcement</button>
    </div>
  );
};

export default Admin;