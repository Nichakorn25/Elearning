import React, { useState } from "react";
import { Badge, Calendar } from "antd";
import type { Dayjs } from "dayjs";
import type { BadgeProps, CalendarProps } from "antd";
import Sidebar from "../Component/Sidebar/Sidebar"; // Sidebar Component
import Header from "../Component/Header/Header"; // Header Component
import AppointmentFrom from "../Component/AppointmentFrom/AppointmentFrom"; // Modal Component
import "./Appointment.css";

const getListData = (value: Dayjs) => {
  let listData: { type: string; content: string }[] = [];
  switch (value.date()) {
    case 8:
      listData = [
        { type: "warning", content: "Project Deadline" },
        { type: "success", content: "Team Meeting" },
      ];
      break;
    case 15:
      listData = [
        { type: "warning", content: "System Maintenance" },
        { type: "success", content: "Weekly Review" },
      ];
      break;
    default:
  }
  return listData || [];
};

const Appointment: React.FC = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false); // สถานะ Modal
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // ฟังก์ชันเปิด/ปิด Sidebar
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  // ฟังก์ชันเปิด Modal
  const openModal = (date: Dayjs) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  // ฟังก์ชันปิด Modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedDate(null);
  };

  // ฟังก์ชันจัดการเมื่อบันทึกฟอร์ม
  const handleFormSubmit = (values: any) => {
    console.log("Form Submitted:", values);
    closeModal();
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type as BadgeProps["status"]} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const onSelectDate = (value: Dayjs) => {
    openModal(value);
  };

  return (
    <div className="appointment-page">
       {/* Header Section */}
       <Header />

      <div className="appointment-content">
        {isSidebarVisible && <Sidebar isVisible={isSidebarVisible} />}

        <div className="calendar-container">
          <h2>Appointment Calendar</h2>
          <Calendar dateCellRender={dateCellRender} onSelect={onSelectDate} />
        </div>
      </div>

      {/* เรียกใช้ AppointmentModal */}
      <AppointmentFrom
        visible={isModalVisible}
        onClose={closeModal}
        selectedDate={selectedDate}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default Appointment;
