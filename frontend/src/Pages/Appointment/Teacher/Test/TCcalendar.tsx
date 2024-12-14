import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import Calendar from "react-calendar"; // Mini Calendar
import "react-calendar/dist/Calendar.css"; // Import Mini Calendar CSS
import "./TCcalendar.css"; // Custom CSS File
import Sidebar from "../../../Component/Sidebar/Sidebar";
import Header from "../../../Component/Header/Header";
import { Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";

const TCcalendar: React.FC = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const [events, setEvents] = useState([
    { id: "1", title: "Meeting", start: "2024-12-12T10:00:00", end: "2024-12-12T11:00:00" },
  ]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const title = prompt("Enter a title for your event:");
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    if (title) {
      setEvents([
        ...events,
        { id: String(events.length + 1), title, start: selectInfo.startStr, end: selectInfo.endStr },
      ]);
    }
  };
  const [view, setView] = useState("timeGridWeek");
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  
    const toggleSidebar = () => {
      setSidebarVisible(!isSidebarVisible); // เปิด/ปิด Sidebar
    };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (window.confirm(`Are you sure you want to delete '${clickInfo.event.title}'?`)) {
      setEvents(events.filter((event) => event.id !== clickInfo.event.id));
    }
  };

  const menu = (
    <Menu
      onClick={(e) => {
        if (e.key === "1") setView("timeGridDay");
        else if (e.key === "2") setView("timeGridWeek");
        else if (e.key === "3") setView("dayGridMonth");
        else if (e.key === "4") setView("yearGrid"); // Placeholder for year view
      }}
    >
      <Menu.Item key="1">
        <span>Day</span>
      </Menu.Item>
      <Menu.Item key="2">
        <span>Week</span>
      </Menu.Item>
      <Menu.Item key="3">
        <span>Month</span>
      </Menu.Item>
      <Menu.Item key="4">
        <span>Year</span>
      </Menu.Item>
    </Menu>
  );


  return (
    <div className="teacher-calendar-layout">
      {/* Header */}
       {/* Header Section */}
       <Header />
       {/* Sidebar */}
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
      <header className="teacher-calendar-header">
        <div className="header-left">
          <div>
            <span className="calendar-icon">📅</span> My Calendar
          </div>
        </div>
        <div className="header-center">
          <button className="today-btn">Today</button>
          <button className="nav-btn">{"<"}</button>
          <button className="nav-btn">{">"}</button>
          <span className="current-date">{formattedDate}</span>
        </div>
        <div className="header-right">
        <Dropdown overlay={menu} trigger={["click"]}>
            <button className="calendar-header__dropdown-btn">
              {view === "timeGridDay"
                ? "Day"
                : view === "timeGridWeek"
                ? "Week"
                : view === "dayGridMonth"
                ? "Month"
                : "Year"}{" "}
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
            <button className="create-btn">+ Create</button>
          </div>
          <div className="mini-calendar">
            <Calendar />
          </div>
          <div className="sidebar-section">
            <h3>My Calendars</h3>
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
            <h3>Other Calendars</h3>
            <button>+</button>
          </div>
        </aside>

        {/* Calendar */}
        <div className="calendar-container">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={view}
            headerToolbar={{
              left: "",
              center: "",
              right: "",
            }}
            selectable
            editable
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

export default TCcalendar;
