import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./TeacherCalendar.css";
import Header from "../../../Component/Header/Header";
import { Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import DynamicCalendarIcon from "../../DynamicCalendarIcon";
import CreateAppointment from "../CreateAppointment/CreateAppointment";
import CreateTaskPopup from "../../Taskpopup/Taskpopup";
import Task from "../../../../assets/check.svg";
import Appointment from "../../../../assets/website.svg";
import Profile from "../../../../assets/user.svg";
import Place from "../../../../assets/map-marker.svg";
import PlacePanel from "../../PlacePanel/PlacePanel";

const TeacherCalendar: React.FC = () => {
  const navigate = useNavigate();
  const calendarRef = useRef<FullCalendar>(null);
  type Event = {
    id: string;
    title: string;
    start: string;
    end?: string; // Optional field
    description?: string;
    category?: string;
  };

  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Meeting",
      start: "2024-12-12T10:00:00",
      end: "2024-12-12T11:00:00",
    },
  ]);

  const [currentView, setCurrentView] = useState("dayGridMonth");
  // const [setIsAppointmentModalVisible] =
  //   useState(false); // สำหรับ Popup

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const { startStr } = selectInfo;

    // เปิด TaskPopup และส่งวันที่ที่เลือกไป
    setSelectedDate(startStr);
    setIsTaskModalVisible(true);

    // Unselect วันที่ใน FullCalendar
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
  };

  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);
  const [isSidebarVisible] = useState(false);

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (
      window.confirm(
        `Are you sure you want to delete '${clickInfo.event.title}'?`
      )
    ) {
      setEvents(events.filter((event) => event.id !== clickInfo.event.id));
    }
  };

  const handleMenuClick = (e: any) => {
    setCurrentView(e.key);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(e.key); // เปลี่ยนมุมมอง
    }
  };

  const viewmenu = (
    <Menu onClick={handleMenuClick} className="createdropdown">
      <Menu.Item key="dayGridMonth">Month</Menu.Item>
      <Menu.Item key="timeGridWeek">Week</Menu.Item>
      <Menu.Item key="timeGridDay">Day</Menu.Item>
    </Menu>
  );

  const handleTodayClick = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
    }
  };

  const handlePrevClick = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
    }
  };

  const handleNextClick = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
    }
  };

  // เปิด Appointment Popup
  // const showAppointmentModal = () => {
  //   setIsAppointmentModalVisible(true);
  // };

  // ปิด Appointment Popup
  // const closeAppointmentModal = () => {
  //   setIsAppointmentModalVisible(false);
  // };

  // เมื่อส่งข้อมูลจาก Popup
  // const handleSubmitAppointment = (values: any) => {
  //   const newEvent = {
  //     id: String(events.length + 1),
  //     title: values.title,
  //     start: `${values.startDate}T${values.startTime}`,
  //     end: `${values.startDate}T${values.endTime}`,
  //     location: values.location,
  //     description: values.description,
  //   };
  //   setEvents([...events, newEvent]);
  //   setIsAppointmentModalVisible(false);
  // };

  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);

  // เปิด Popup
  // const showTaskModal = () => {
  //   setSelectedDate(null); // ตั้งค่า selectedDate เป็น null เพื่อไม่ให้มีวันที่เริ่มต้น
  //   setIsTaskModalVisible(true); // เปิด TaskPopup
  // };

  // ปิด Popup
  const handleCloseTaskModal = () => {
    setIsTaskModalVisible(false);
  };

  // เมื่อส่งข้อมูล Task
  const handleSubmitTask = (values: any) => {
    // ตรวจสอบว่าค่า date และ time มีอยู่และอยู่ในรูปแบบที่ถูกต้อง
    if (!values.date || !values.time) {
      console.error("Date or Time is missing!");
      return;
    }

    // สร้าง Task ใหม่
    const newEvent = {
      id: String(events.length + 1),
      title: values.title || "Untitled Task",
      start: `${values.date}T${values.time}`,
      description: values.description || "No description provided",
      category: values.category || "General",
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setIsTaskModalVisible(false);
    console.log("New Task Added:", newEvent);
  };

  // const createMenu = (
  //   <Menu className="createdropdown">
  //     {/* Task Menu */}
  //     <Menu.Item key="task" onClick={() => setIsTaskModalVisible(true)}>
  //       Task
  //     </Menu.Item>
  //     {/* Appointment Menu */}
  //     {/* <Menu.Item key="appointment" onClick={() => setIsAppointmentModalVisible(true)}>
  //       Appointment Schedule
  //     </Menu.Item> */}
  //   </Menu>
  // );

  useEffect(() => {
    if (calendarRef.current) {
      setTimeout(() => {
        const calendarApi = calendarRef.current!.getApi(); // หรือใช้ calendarRef.current?.getApi()
        calendarApi.updateSize();
      }, 300); // รอให้ Transition ของ Sidebar เสร็จสิ้น
    }
  }, [isSidebarVisible]);

  //=================================popup==================================
  const [isPopup, setPopUp] = useState(false);

  const [isMapVisible, setIsMapVisible] = useState(false);

  const toggleMapPopup = () => {
    setIsMapVisible(!isMapVisible);
  };

  return (
    <div className="teachercalendar-layout">
      <Header />
      {/* Header */}
      <header className="teachercalendar-header">
        <div className="teachercalendar-header-left">
          <h1 className="teachercalendar-calendar-title">
            <DynamicCalendarIcon />
            <span className="teachercalendar-mycalendar">Calendar</span>
          </h1>
        </div>
        <div className="teachercalendar-header-center">
          <button
            className="teachercalendar-today-btn"
            onClick={handleTodayClick}
          >
            Today
          </button>
          <button className="teachercalendar-nav-btn" onClick={handlePrevClick}>
            {"<"}
          </button>
          <button className="teachercalendar-nav-btn" onClick={handleNextClick}>
            {">"}
          </button>
          <span className="teachercalendar-current-date">{formattedDate}</span>
        </div>
        <div className="teachercalendar-header-right">
          <Dropdown overlay={viewmenu} trigger={["click"]}>
            <button className="teachercalendar-calendar-header__dropdown-btn">
              {currentView === "timeGridDay"
                ? "Day"
                : currentView === "timeGridWeek"
                ? "Week"
                : "Month"}{" "}
              <DownOutlined />
            </button>
          </Dropdown>
        </div>
      </header>

      {/* Main Layout */}
      <div className="teachercalendar-main">
        {/* Sidebar */}
        <aside className="teachercalendar-sidebar">
          {/* ปุ่ม popup CreateAppointment */}
          <div
            onClick={() => setPopUp(!isPopup)}
            className="teachercalendar-create-appointment-btn"
          >
            + CreateAppointment
          </div>
          {isPopup && (
            <div>
              <CreateAppointment />
            </div>
          )}

          <div className="teachercalendar-mini-calendar">
            <Calendar />
          </div>

          <div className="teachercalendar-sidebar-section">
            <h3>Other Task</h3>
            <button
              className="teachercalendar-create-task-btn"
              onClick={() => setIsTaskModalVisible(true)}
            >
              +
            </button>
          </div>

          {/* Popup สำหรับ Task */}
          <CreateTaskPopup
            isVisible={isTaskModalVisible}
            onClose={handleCloseTaskModal}
            onSubmit={handleSubmitTask}
            selectedDate={selectedDate}
          />
        </aside>

        {/* Calendar */}
        <div className="teachercalendar-calendar-container">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={currentView}
            headerToolbar={false} // ซ่อน header toolbar ของ FullCalendar
            selectable
            editable
            views={{
              listYear: {
                type: "list",
                duration: { years: 1 },
                buttonText: "Year",
              },
            }}
            events={events}
            select={handleDateSelect}
            eventClick={handleEventClick}
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
          />

          {/* Icon Menu */}
          <div className="teachercalendar-icon-menu">
            <div className="teachercalendar-icon-item">
              <img src={Task} alt="Task Icon" />
              <span className="teachercalendar-tooltip">Task</span>
            </div>
            <div className="teachercalendar-icon-item">
              <img src={Appointment} alt="Meeting Icon" />
              <span className="teachercalendar-tooltip">Appointment</span>
            </div>
            <div
              className="teachercalendar-icon-item"
              onClick={() => navigate("/profile")}
            >
              <img src={Profile} alt="Profile Icon" />
              <span className="teachercalendar-tooltip">Profile</span>
            </div>
            <div className="teachercalendar-icon-item" onClick={toggleMapPopup}>
              <img src={Place} alt="Place Icon" />
              <span className="teachercalendar-tooltip">Place</span>
            </div>
            {/* Map Popup */}
            {isMapVisible && (
              <div className="teachercalendar-map-popup">
                <div className="teachercalendar-map-header">
                  Suranaree University of Technology<br />
                  <button
                    onClick={toggleMapPopup}
                    className="teachercalendar-close-btn"
                  >
                    ✖
                  </button>
                </div>
                <iframe
                  title="Google Maps"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.123456789123!2d102.456789!3d14.567890123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0000000000000000%3A0x000000000000000!2sSuranaree%20University%20of%20Technology!5e0!3m2!1sen!2sth!4v1680000000000!5m2!1sen!2sth"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCalendar;
