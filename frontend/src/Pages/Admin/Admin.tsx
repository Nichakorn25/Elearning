import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import Sidebar from '../Component/Sidebar/Sidebar';
import Header from '../Component/Header/Header';
import { ListUsers } from '../../services/https';
import { NotificationOutlined, UserOutlined, FileDoneOutlined, SolutionOutlined, FormOutlined } from '@ant-design/icons';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await ListUsers();
        if (response?.data) {
          const activeCount = response.data.filter((user: any) => user.Status === 'Active').length;
          const inactiveCount = response.data.filter((user: any) => user.Status === 'Inactive').length;

          setActiveUsers(activeCount);
          setInactiveUsers(inactiveCount);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUsers();
  }, []);

  const goToAnnouncement = () => navigate('/Announcement');
  const goToConfirmTransfer = () => navigate('/ConfirmTransfer');
  const goToManageRoleRequests = () => navigate('/ManageRoleRequests');
  const goToManageUsers = () => navigate('/ManageUsers');
  const goToAdminFillDetails = () => navigate('/AdminFillDetails');

  return (
    <div className="profile-content">
      <Header />

      {isSidebarVisible && <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />}

      <div className="admin-card">
        <h2>Admin Dashboard</h2>
        <div className="admin-course-list">
          <div className="admin-course-card">
            <h3>Active Users</h3>
            <p className="user-count active-count">{activeUsers}</p>
          </div>
          <div className="admin-course-card">
            <h3>Inactive Users</h3>
            <p className="user-count inactive-count">{inactiveUsers}</p>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>ระบบแอดมิน</h2>
        <div className="admin-buttons">
          <button onClick={goToAnnouncement} className="admin-button">
            <NotificationOutlined /> Announcement
          </button>
          <button onClick={goToManageRoleRequests} className="admin-button">
            <SolutionOutlined /> Manage Role Change Requests
          </button>
          <button onClick={goToManageUsers} className="admin-button">
            <UserOutlined /> Manage Users
          </button>
        </div>
        <div className="admin-buttons">
          <button onClick={goToConfirmTransfer} className="admin-button">
            <FileDoneOutlined /> Confirm Payment Transfers
          </button>
          <button onClick={goToAdminFillDetails} className="admin-button">
            <FormOutlined /> Fill Additional Course Details
          </button>
        </div>
      </div>

    </div>
  );
};

export default Admin;