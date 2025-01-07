import React from 'react';
import './HeaderTabBFLogin.css'; // เพิ่ม CSS เฉพาะสำหรับ Header
import logo from '../../../assets/sutbranding2.jpg';
import { useNavigate } from 'react-router-dom';

interface HeaderTabBFLoginProps {
  onLoginClick: () => void;
}

const HeaderTabBFLogin: React.FC<HeaderTabBFLoginProps> = ({ onLoginClick }) => {
    const navigate = useNavigate(); 

    const goToHome = () => {
        navigate('/BeforeLogin');
    };
    const goToAllCourses = () => {
        navigate('/AllCourse');
    };

    const goToForTeacher = () => {
        navigate('/ForTeacher');
    };

    const goToForStudent = () => {
        navigate('/ForStudent');
    }; 

  return (
    <header className="headerTabBeforeLogin">
      {/* โลโก้ */}
      <div className="logoContainerTabBeforeLogin">
        <img src={logo} alt="โลโก้" className="logoTabBeforeLogin" />
      </div>

      {/* ลิงก์เมนู */}
      <div className="headerLinksTabBeforeLogin">
        <a onClick={goToHome} style={{ cursor: 'pointer' }}>Home</a>
        <a onClick={goToAllCourses} style={{ cursor: 'pointer' }}>Course</a>
        <a onClick={goToForTeacher} style={{ cursor: 'pointer' }}>Teacher</a>
        <a onClick={goToForStudent} style={{ cursor: 'pointer' }}>Student</a>
      </div>

      {/* ปุ่มเข้าสู่ระบบ */}
      <button className="loginButtonTabBeforeLogin" onClick={onLoginClick}>
        เข้าสู่ระบบ
      </button>
    </header>
  );
};

export default HeaderTabBFLogin;
