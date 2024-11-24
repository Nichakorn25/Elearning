import React, { useState } from 'react';
import './AllCourse.css'; // ไฟล์ CSS สำหรับหน้า AllCourses
import { useNavigate } from 'react-router-dom'
import HeaderTabBFLogin from "../Component/HeaderTabBFLogin/HeaderTabBFLogin";
import LoginPopup from '../LoginPopup/LoginPopup'; // Import LoginPopup

const AllCourse: React.FC = () => {
    const [isLoginPopupVisible, setLoginPopupVisible] = useState(false);
    const navigate = useNavigate();
  
    // ฟังก์ชันแสดง Popup
    const handleOpenLoginPopup = () => {
      setLoginPopupVisible(true);
    };
  
    // ฟังก์ชันซ่อน Popup
    const closeLoginPopup = () => {
      setLoginPopupVisible(false);
    };
  
    // ฟังก์ชันเปลี่ยนหน้าไป BeforeLogin
    const handleNavigateToBeforeLogin = () => {
      navigate('/beforeLogin', { state: { showLoginPopup: true } });
    };
  return (
    <div>
      {/* เรียกใช้ Header */}
      <HeaderTabBFLogin onLoginClick={handleOpenLoginPopup} />

      <div className="all-courses-container">
        <h1>SUT e-Learning</h1>
        <p>หน้าหลัก / รายวิชาทั้งหมด</p>
        <div className="search-container">
          <input
            type="text"
            placeholder="ค้นหารายวิชา"
            className="search-input"
          />
          <button className="search-button">🔍</button>
        </div>
      </div>

      {/* ค้นหารายวิชา */}
      <div className="allmajor">
        {/* รายการหมวดหมู่รายวิชา */}
        <ul className="course-list">
          <li>สำนักวิชาวิทยาศาสตร์ (Institute of Science)</li>
          <li>สำนักวิชาเทคโนโลยีการเกษตร (Institute of Agricultural Technology)</li>
          <li>สำนักวิชาเทคโนโลยีสังคม (Institute of Social Technology)</li>
          <li>สำนักวิชาวิศวกรรมศาสตร์ (Institute of Engineering)</li>
          <li>สำนักวิชาพยาบาลศาสตร์ (Institute of Nursing)</li>
          <li>สำนักวิชาแพทยศาสตร์ (Institute of Medicine)</li>
          <li>สำนักวิชาทันตแพทยศาสตร์ (Institute of Dentistry)</li>
          <li>สำนักวิชาสาธารณสุขศาสตร์ (Institute of Public Health)</li>
        </ul>
      </div>

      {/* แสดง LoginPopup */}
      {isLoginPopupVisible && <LoginPopup onClose={closeLoginPopup} />}
    </div>
  );
};

export default AllCourse;
