import React from "react";
import "./Header.css";
//import calendarIcon from "../../../../assets/calendar.png"; // ใช้ import SVG เป็น URL
import { Dropdown, Menu } from "antd"; // นำเข้า Dropdown จาก Ant Design
import { DownOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const Header: React.FC = () => {
  const currentDate = new Date(); // วันที่ปัจจุบัน
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = currentDate.toLocaleDateString("en-US", options); // รูปแบบวันที่

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <span>Day</span>
        <span style={{ float: "right" }}>D</span>
      </Menu.Item>
      <Menu.Item key="2">
        <span>Week</span>
        <span style={{ float: "right" }}>W</span>
      </Menu.Item>
      <Menu.Item key="3">
        <span>Month</span>
        <span style={{ float: "right" }}>M</span>
      </Menu.Item>
      <Menu.Item key="4">
        <span>Year</span>
        <span style={{ float: "right" }}>Y</span>
      </Menu.Item>
      <Menu.Item key="5">
        <span>Schedule</span>
        <span style={{ float: "right" }}>A</span>
      </Menu.Item>
      <Menu.Item key="6">
        <span>4 days</span>
        <span style={{ float: "right" }}>X</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item disabled>
        <span>Show weekends</span>
      </Menu.Item>
      <Menu.Item>
        <span>Show declined events</span>
      </Menu.Item>
      <Menu.Item>
        <span>Show completed tasks</span>
      </Menu.Item>
      <Menu.Item>
        <span>Show appointment schedules</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="calendar-header">
      <div className="calendar-header__left">
        <button className="calendar-header__menu-btn">≡</button>
        {/* <div className="calendar-header__logo">
          <img src={calendarIcon} alt="Calendar Icon" className="calendar-header__logo-icon" />
          <span className="calendar-header__logo-text">Calendar</span>
        </div> */}
        <button className="calendar-header__today-btn">Today</button>
        <div className="calendar-header__navigation">
          <button className="calendar-header__nav-btn">{"<"}</button>
          <button className="calendar-header__nav-btn">{">"}</button>
        </div>
        {/* ใช้วันที่แบบไดนามิก */}
        <span className="calendar-header__date-display">{formattedDate}</span>
      </div>
      <div className="calendar-header__right">
        <button className="calendar-header__icon-btn">🔍</button>
        <button className="calendar-header__icon-btn">❓</button>
        <button className="calendar-header__icon-btn">⚙️</button>
        <div className="calendar-header__view-selector">
          <Dropdown overlay={menu} trigger={["click"]}>
            <button className="calendar-header__dropdown-btn">
              Day <DownOutlined />
            </button>
          </Dropdown>
        </div>
        <div className="calendar-header__profile">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="calendar-header__profile-img"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
