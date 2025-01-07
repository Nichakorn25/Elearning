import React from 'react';
import './HeaderBeforeLogin.css'; // เพิ่ม CSS เฉพาะสำหรับ Header
import logo from '../../../assets/sutbranding2.jpg';
import { useNavigate } from 'react-router-dom';

interface HeaderBeforeLoginProps {
  onLoginClick: () => void;
}

const HeaderBeforeLogin: React.FC<HeaderBeforeLoginProps> = ({ onLoginClick }) => {
    const navigate = useNavigate(); 

    // ฟังก์ชันนำทางไปยัง "/all-courses"
    const goToAllCourses = () => {
        navigate('/AllCourse');
      };

    const goToForTeacher = () => {
        navigate('/ForTeacher');
    }

    const goToForStudent = () => {
      navigate('/ForStudent');
  }

  return (
    <header className="headerbeforelogin">
      {/* โลโก้ */}
      <div className="logo-containerbeforelogin">
        <img src={logo} alt="โลโก้" className="logobeforelogin" />
      </div>

      {/* ช่องค้นหา */}
      <input
        type="text"
        placeholder="ค้นหารายวิชา"
        className="search-barbeforelogin"
      />

      {/* ลิงก์เมนู */}
      <div className="header-linksbeforelogin">
        <a onClick={goToAllCourses} style={{ cursor: 'pointer' }}>รายวิชาทั้งหมด</a>
        <a onClick={goToForTeacher} style={{ cursor: 'pointer' }}>สำหรับอาจารย์</a>
        <a onClick={goToForStudent} style={{ cursor: 'pointer' }}>สำหรับนักศึกษา</a>
      </div>

      {/* ปุ่มเข้าสู่ระบบ */}
      <button className="login-buttonbeforelogin" onClick={onLoginClick}>
        เข้าสู่ระบบ
      </button>
    </header>
  );
};

export default HeaderBeforeLogin;
