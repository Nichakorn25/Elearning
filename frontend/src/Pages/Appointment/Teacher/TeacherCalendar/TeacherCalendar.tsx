import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import TeacherCalendarComponent from "../TeacherCalendarComponent/TeacherCalendarComponent";
import "./TeacherCalendar.css";
import MainHeader from "../../../Component/Header/Header";
import MainSidebar from "../../../Component/Sidebar/Sidebar";

const TeacherCalendar: React.FC = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible); // เปิด/ปิด Sidebar
  };

  return (
    <div className="teacher-dashboard">
      {" "}
      {/* Header Section */}
      <MainHeader />
      {/* Sidebar */}
      <MainSidebar
        isVisible={isSidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
      <Header />
      <div className="content">
        <Sidebar />
        <TeacherCalendarComponent />
      </div>
    </div>
  );
};

export default TeacherCalendar;
