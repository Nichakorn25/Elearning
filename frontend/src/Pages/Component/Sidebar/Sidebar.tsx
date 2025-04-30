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



  const goToStudentDashboard = () => {
    navigate("/dashboard");
    onClose();
  };

  const goToTeacherDashboard = () => {
    navigate("/dashboard");
    onClose();
  };

  const goToClassSchedule = () => {
    navigate("/ClassSchedule");
    onClose();
  };

  const goToStudentCalendar = () => {
    navigate("/StudentCalendar");
    onClose();
  };

  const goToTeacherCalendar = () => {
    navigate("/TeacherCalendar");
    onClose();
  };

  const goToCoursesOpen = () => {
    navigate("/dashboard");
    onClose();
  };

  const goToRequestChangeRole = () => {
    navigate("/RequestChangeRole");
    onClose();
  };

  const goToCreateCourse = () => {
    navigate("/CreateCourse");
    onClose();
  };
  const goToPurchased = () => {
    navigate("/Purchased");
    onClose();
  };
  const goToBuysheet= () => {
    navigate("/Buysheet");
    onClose();
  };
  const goToCheckSeller = () => {
    navigate("/CheckSeller");
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
        {userRole === "1" && <li onClick={goToStudentDashboard}>Dashboard</li>}
        {userRole === "2" && <li onClick={goToTeacherDashboard}>Dashboard</li>}
        {userRole === "3" && <li onClick={goToStudentDashboard}>Dashboard</li>}
        {userRole === "1" && <li onClick={goToClassSchedule}>Class Schedule</li>}
        {userRole === "2" && <li onClick={goToClassSchedule}>Class Schedule</li>}
        {userRole === "3" && <li onClick={goToClassSchedule}>Class Schedule</li>}
        {userRole === "1" && <li onClick={goToStudentCalendar}>Calendar</li>}
        {userRole === "2" && <li onClick={goToTeacherCalendar}>Calendar</li>}
        {userRole === "3" && <li onClick={goToTeacherCalendar}>Calendar</li>}
        {userRole === "1" && <li onClick={goToCoursesOpen}>Courses Open</li>}
        {userRole === "3" && <li onClick={goToCoursesOpen}>Courses Open</li>}
        {userRole === "2" && <li onClick={goToCreateCourse}>Courses Create</li>}
        {userRole === "1" && <li onClick={goToPurchased}>My Sheet</li>}
        {userRole === "1" && <li onClick={goToBuysheet}>Buy Sheet</li>}
        {userRole === "1" && <li onClick={goToCheckSeller}>Seal Sheet</li>}
        {userRole === "1" && <li onClick={goToRequestChangeRole}>Request for Change Role</li>}
      </ul>
    </div>
  );
};

export default Sidebar;