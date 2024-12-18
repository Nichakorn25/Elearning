import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./StudentCalendar.css";
import Header from "../../../Component/Header/Header";
import { Menu, Dropdown, Button , Modal } from "antd";
import { DownOutlined } from "@ant-design/icons";
import DynamicCalendarIcon from "../../Teacher/TeacherCalendar/DynamicCalendarIcon";
//import CreateAppointmentPopup from "../CreateAppointment/CreateAppointment";
import StudentBooking from "../StudentBooking/StudentBooking";
import CreateTaskPopup from "../../Teacher/Taskpopup/Taskpopup";

const StudentCalendar: React.FC = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Meeting",
      start: "2024-12-12T10:00:00",
      end: "2024-12-12T11:00:00",
    },
  ]);
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const [isModalVisible, setIsModalVisible] = useState(false); // สำหรับ Popup
  const [isBookingVisible, setIsBookingVisible] = useState(false);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const title = prompt("Enter a title for your event:");
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

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

  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

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
      calendarApi.changeView(e.key);
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

  // เปิด Popup
  const showModal = () => {
    setIsModalVisible(true);
  };

  // ปิด Popup
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const showBooking = () => {
    setIsBookingVisible(true);
  };

  const handleCloseBooking = () => {
    setIsBookingVisible(false);
  };

  const showTaskModal = () => {
    setIsTaskModalVisible(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalVisible(false);
  };

  const createMenu = (
    <Menu className="createdropdown">
      {/* <Menu.Item key="event">Event</Menu.Item> */}
      <Menu.Item key="task" onClick={showTaskModal}>
        Task
      </Menu.Item>
      <Menu.Item key="appointment" onClick={showBooking}>
        Make an Appointment
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="teacher-calendar-layout">
      <Header />
      {/* Header */}
      <header className="teacher-calendar-header">
        <div className="header-left">
          <h1 className="calendar-title">
            <DynamicCalendarIcon />
            <span className="mycalendar">Calendar</span>
          </h1>
        </div>
        <div className="header-center">
          <button className="today-btn" onClick={handleTodayClick}>
            Today
          </button>
          <button className="nav-btn" onClick={handlePrevClick}>
            {"<"}
          </button>
          <button className="nav-btn" onClick={handleNextClick}>
            {">"}
          </button>
          <span className="current-date">{formattedDate}</span>
        </div>
        <div className="header-right">
          <Dropdown overlay={viewmenu} trigger={["click"]}>
            <button className="calendar-header__dropdown-btn">
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
      <div className="teacher-calendar-main">
        {/* Sidebar */}
        <aside className="calendar-sidebar">
          <div className="sidebar-header">
            <Dropdown overlay={createMenu} trigger={["click"]}>
              <Button className="create-btn">
                + Create <DownOutlined />
              </Button>
            </Dropdown>
          </div>

          {isBookingVisible && <StudentBooking />}
          {isTaskModalVisible && (
            <CreateTaskPopup
              isVisible={isTaskModalVisible}
              onClose={handleCloseTaskModal}
              onSubmit={() => console.log("Task Submitted")}
            />
          )}

          <Modal
            title="Make an Appointment"
            visible={isBookingVisible}
            onCancel={handleCloseBooking}
            footer={null}
            centered
          >
            <StudentBooking />
          </Modal>

          {/* แสดง Popup เมื่อคลิกปุ่ม + Create */}
          {/* <CreateAppointmentPopup
            isVisible={isModalVisible}
            onClose={handleCloseModal}
            onSubmit={handleSubmitAppointment}
          /> */}

          <div className="mini-calendar">
            <Calendar />
          </div>
          <div className="sidebar-section">
            <h3>My Tasks</h3>
            <ul>
              <li>
                <input type="checkbox" defaultChecked />
                Nichakorn Chanyutha
              </li>
              <li>
                <input type="checkbox" defaultChecked />
                Birthdays
              </li>
              <li>
                <input type="checkbox" defaultChecked />
                Tasks
              </li>
            </ul>
          </div>
          <div className="sidebar-section">
            <h3>Other Task</h3>
            <button>+</button>
          </div>
        </aside>

        {/* Calendar */}
        <div className="calendar-container">
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
        </div>
      </div>
    </div>
  );
};

export default StudentCalendar;
