import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
  isVisible: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible }) => {
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <div className={`sidebar ${isVisible ? 'visible' : ''}`}>
      <ul>
        <li onClick={() => navigateTo('/dashboard')}>Dashboard</li>
        <li onClick={() => navigateTo('/ClassSchedule')}>Class Schedule</li>
        <li onClick={() => navigateTo('/Appointment')}>Appointment</li>
        <li onClick={() => navigateTo('/profile')}>Courses open</li>
        <li onClick={() => navigateTo('/TeacherSchedule')}>Teacher Schedule</li>
        <li onClick={() => navigateTo('/Buysheet')}>Buy Sheet</li>
      </ul>
    </div>
  );
};

export default Sidebar;
