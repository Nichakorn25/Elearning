import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

interface SidebarProps {
  isVisible: boolean; // กำหนดสถานะการมองเห็น Sidebar
  onClose: () => void; // ฟังก์ชันสำหรับปิด Sidebar
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
  const navigate = useNavigate();

   // Get user role and user data from localStorage
   const userRole = localStorage.getItem("role"); // RoleID: '1', '2', '3'
   //const user = JSON.parse(localStorage.getItem("user") || "{}");

  const navigateTo = (path: string) => {
    navigate(path); // เปลี่ยนหน้า
    onClose(); // ปิด Sidebar
  };

  const goToClassSchedule = () => {
    navigate("/ClassSchedule");
    onClose();
  };

  const goToStudentCalendar = () => {
    navigate("/StudentCalendar");
    onClose();
  };

  const goToRequestChangeRole = () => {
    navigate("/RequestChangeRole");
    onClose();
  };


  useEffect(() => {
    // ปรับ margin-left ของ #root ตามสถานะ Sidebar
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.style.transition = "margin-left 0.3s ease";
      rootElement.style.marginLeft = isVisible ? "250px" : "0";
    }
    return () => {
      if (rootElement) rootElement.style.marginLeft = "0"; // รีเซ็ตเมื่อ Component ถูกถอด
    };
  }, [isVisible]);

  return (
    <div className={`sidebar ${isVisible ? "visible" : ""}`}>
      <ul>
        <li onClick={() => navigateTo("/dashboard")}>Dashboard</li>
        {userRole === "1" && <li onClick={goToClassSchedule}>Class Schedule</li>}
        {userRole === "1" && <li onClick={goToStudentCalendar}>Calendar</li>}
        <li onClick={() => navigateTo("/TeacherCalendar")}>Calendar</li>
        <li onClick={() => navigateTo("/profile")}>Courses Open</li>
        <li onClick={() => navigateTo("/Buysheet")}>Buy Sheet</li>
        <li onClick={() => navigateTo("/CheckSeller")}>Seal Sheet</li>
        {userRole === "1" && <li onClick={goToRequestChangeRole}>Request for Change Role</li>}
      </ul>
    </div>
  );
};

export default Sidebar;
