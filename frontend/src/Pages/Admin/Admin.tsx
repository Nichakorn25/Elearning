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
    navigate('/Announcement'); // เปลี่ยนเส้นทางไปหน้า Announcement
  };

  const goToConfirmTransfer = () => {
    navigate('/ConfirmTransfer'); // เปลี่ยนเส้นทางไปหน้า Confirm Transfer
  };

  const goToManageRoleRequests = () => {
    navigate('/ManageRoleRequests');
  };

  return (
    <div className="admin-dashboard">
      <Header />

      {isSidebarVisible && <Sidebar isVisible={isSidebarVisible} />}

      <div className="admin-overview">
        <h2>Admin Dashboard</h2>
        <div className="admin-course-list">
          <div className="admin-course-card">
            <h3>ENG23 3054 Operating Systems</h3>
            <p>Asst. Dr. Prof...</p>
          </div>
          <div className="admin-course-card">
            <h3>ENG23 4041 CYBER SECURITY FUNDAMENTALS</h3>
            <p>02/2567 ...</p>
          </div>
        </div>

        {/* Buttons Section */}
      <div className="admin-buttons">
        <button onClick={goToAnnouncement} className="admin-button">Announcement</button>
        <button onClick={goToConfirmTransfer} className="admin-button confirm-transfer-button">
          Confirm Payment Transfers
        </button>
        <button onClick={goToManageRoleRequests} className="admin-button manage-role-requests-button">
          Manage Role Change Requests
        </button>
      </div>
      </div>

      
    </div>

  );
};

export default Admin;
