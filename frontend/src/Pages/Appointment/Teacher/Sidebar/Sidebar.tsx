import React from "react";
import "./Sidebar.css";
import Calendar from "react-calendar"; // ใช้ react-calendar สำหรับ Mini Calendar
import "react-calendar/dist/Calendar.css";

const Sidebar: React.FC = () => {
  return (
    <aside className="calendar-sidebar">
      {/* โลโก้และปุ่ม +Create */}
      <div className="calendar-sidebar__header">

        <button className="calendar-sidebar__create-btn">
          + Create
          <span className="calendar-sidebar__dropdown-arrow">▼</span>
        </button>
      </div>

      {/* Mini Calendar */}
      <div className="calendar-sidebar__mini-calendar">
        <Calendar />
      </div>

      {/* Search for people */}
      <div className="calendar-sidebar__search">
        <input
          type="text"
          placeholder="Search for people"
          className="calendar-sidebar__search-input"
        />
      </div>

      {/* My Calendars */}
      <h3 className="calendar-sidebar__section-title">My calendars</h3>
      <ul className="calendar-sidebar__list">
        <li className="calendar-sidebar__list-item">
          <input type="checkbox" defaultChecked />
          <span className="calendar-sidebar__list-label">
            Nichakorn Chanyutha
          </span>
        </li>
        <li className="calendar-sidebar__list-item">
          <input type="checkbox" defaultChecked />
          <span className="calendar-sidebar__list-label">Birthdays</span>
        </li>
        <li className="calendar-sidebar__list-item">
          <input type="checkbox" defaultChecked />
          <span className="calendar-sidebar__list-label">Tasks</span>
        </li>
      </ul>

      {/* Other Calendars */}
      <h3 className="calendar-sidebar__section-title">Other calendars</h3>
      <button className="calendar-sidebar__add-calendar-btn">+</button>
    </aside>
  );
};

export default Sidebar;
