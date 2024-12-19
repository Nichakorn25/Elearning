import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

interface SidebarProps {
  isVisible: boolean; // กำหนดสถานะการมองเห็น Sidebar
  onClose: () => void; // ฟังก์ชันสำหรับปิด Sidebar
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path); // เปลี่ยนหน้า
    onClose(); // ปิด Sidebar
  };

  return (
    <div className={`sidebar ${isVisible ? "visible" : ""}`}>
      <ul>
        <li onClick={() => navigateTo("/dashboard")}>Dashboard</li>
        <li onClick={() => navigateTo("/ClassSchedule")}>Class Schedule</li>
        <li onClick={() => navigateTo("/TCcalendar")}>Calendar</li>
        <li onClick={() => navigateTo("/profile")}>Courses Open</li>
        <li onClick={() => navigateTo("/TeacherSchedule")}>Teacher Schedule</li>
        <li onClick={() => navigateTo("/Buysheet")}>Buy Sheet</li>
        <li onClick={() => navigateTo("/RequestChangeRole")}>Request for Change Role</li>
      </ul>
    </div>
  );
};

export default Sidebar;
