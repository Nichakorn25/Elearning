import React, { useState } from 'react';
import './ClassSchedule.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Component/Sidebar/Sidebar';
import Header from '../Component/Header/Header'; // เรียกใช้ Header ที่แยกไว้


const ClassSchedule: React.FC = () => {
  // ช่วงเวลา (Time Slots)
  const timeslots = [
    '08:00-09:00',
    '09:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '12:00-13:00',
    '13:00-14:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00',
    '17:00-18:00',
    '18:00-19:00',
    '19:00-20:00',
  ];

  // ข้อมูลตารางเรียน (Days & Slots)
  const [schedule, setSchedule] = useState(
    ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์'].map((day) => ({
      day,
      slots: Array(timeslots.length).fill(''), // เตรียมช่องเวลาเปล่า
    }))
  );

  const handleSave = () => {
    console.log('Saving schedule...', schedule);
    alert('ตารางเรียนถูกบันทึก!');
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

  return (
    <div className="dashboard">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="dashboardheader-left">
          {!isSidebarVisible && (
            <button className="dashboardmenu-button" onClick={toggleSidebar}>
              ☰
            </button>
          )}
          <h1>SUT e-Learning</h1>
        </div>

        <div className="dashboardheader-right">
          {/* คลิก User ID, Name หรือ Avatar เพื่อเปิด dropdown */}
          <div className="dashboarduser-info" onClick={toggleDropdown}>
            <span className="dashboarduser-id">B65xxxxx</span>
            <span className="dashboarduser-name">Username</span>
            <img
              src="https://via.placeholder.com/40"
              alt="User Avatar"
              className="dashboarduser-avatar"
            />
            {/* ลูกศรสำหรับ Dropdown */}
            <i className={`arrow ${isDropdownVisible ? 'down' : 'up'}`}></i>
          </div>

          {/* Dropdown Menu */}
          {isDropdownVisible && (
            <div className="dashboarddropdown-menu">
              <button onClick={goToDashboard}>Dashboard</button>
              <button onClick={goToProfile}>Profile</button>
              <button onClick={goToBuySheet}>BuySheet</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar isVisible={isSidebarVisible} />

      {/* Schedule Table */}
      <section className="schedule-table">
        <h2>ตารางเรียน</h2>
        <table>
          <thead>
            <tr>
              <th>Day</th>
              {timeslots.map((slot, index) => (
                <th key={index}>{slot}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {/* แสดงชื่อวันในคอลัมน์ Day */}
                <td>{row.day}</td>
                {row.slots.map((slot, slotIndex) => (
                  <td key={slotIndex}>
                    <input
                      type="text"
                      value={slot}
                      onChange={(e) => {
                        const newSchedule = [...schedule];
                        newSchedule[rowIndex].slots[slotIndex] = e.target.value;
                        setSchedule(newSchedule);
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Footer */}
      <footer className="footer">
        <button className="save-button" onClick={handleSave}>
          บันทึกตาราง
        </button>
        <button className="add-course-button">เพิ่มวิชา</button>
      </footer>
    </div>
  );
};

export default ClassSchedule;
