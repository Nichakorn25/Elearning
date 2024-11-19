import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  isVisible: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible }) => {
  return (
    <div className={`sidebar ${isVisible ? 'visible' : ''}`}>
      <ul>
        <li><a href="/dashboard">Class Schedule</a></li>
        <li><a href="/courses">Appointment</a></li>
        <li><a href="/profile">Courses open</a></li>
        <li><a href="/logout">Teacher Schedule</a></li>
        <li><a href="/Buysheet">Buy Sheet</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
