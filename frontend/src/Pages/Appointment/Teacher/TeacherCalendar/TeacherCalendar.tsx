import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import TeacherCalendarComponent from "../TeacherCalendarComponent/TeacherCalendarComponent";
import "./TeacherCalendar.css";

const TeacherCalendar: React.FC = () => {
  return (
    <div className="teacher-dashboard">
      <Header />
      <div className="content">
        <Sidebar />
        <TeacherCalendarComponent />
      </div>
    </div>
  );
};

export default TeacherCalendar;
