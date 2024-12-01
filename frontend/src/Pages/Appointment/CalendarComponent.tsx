import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./CalendarComponent.css";
import FullCalendar from '@fullcalendar/react'; // นำเข้า FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid'; // สำหรับการแสดงปฏิทินรายเดือน
import timeGridPlugin from '@fullcalendar/timegrid'; // สำหรับการแสดงรายสัปดาห์หรือรายวัน
import interactionPlugin from '@fullcalendar/interaction'; // สำหรับการลากและคลิก
import { DateSelectArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import Sidebar from '../Component/Sidebar/Sidebar';
import Header from '../Component/Header/Header'; // เรียกใช้ Header ที่แยกไว้


const CalendarComponent: React.FC = () => {
  const [events, setEvents] = useState([
    { id: "1", title: "นัดหมาย A", start: "2024-12-01T10:00:00", end: "2024-12-01T11:00:00" },
    { id: "2", title: "นัดหมาย B", start: "2024-12-02T14:00:00", end: "2024-12-02T15:00:00" },
  ]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const title = prompt("กรุณากรอกชื่อกิจกรรม");
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // เคลียร์การเลือก

    if (title) {
      setEvents([
        ...events,
        {
          id: String(events.length + 1),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
        },
      ]);
    }
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (window.confirm(`ต้องการลบกิจกรรม '${clickInfo.event.title}' หรือไม่?`)) {
      clickInfo.event.remove();
    }
  };

  const renderEventContent = (eventContent: EventContentArg) => {
    return (
      <>
        <b>{eventContent.timeText}</b>
        <i>{eventContent.event.title}</i>
      </>
    );
  };

  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  const goToDashboard = () => {
    closeDropdown();
    navigate('/dashboard');
  };

  const handleLogout = () => {
    console.log('Logging out...');
    closeDropdown();
    navigate('/');
  };

  const goToProfile = () => {
    closeDropdown();
    navigate('/profile');
  };

  const goToBuySheet = () => {
    closeDropdown();
    navigate('/Buysheet');
  };

  const [isPopupVisible, setPopupVisible] = useState(false);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  return (
    <div className="calendar-container">
         {/* Header Section */}
      <Header />
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        editable={true}
        events={events}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventContent={renderEventContent} // การแสดงเนื้อหาในบล็อก
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
      />
    </div>
  );
};

export default CalendarComponent;
