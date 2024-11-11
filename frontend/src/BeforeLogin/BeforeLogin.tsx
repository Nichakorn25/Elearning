import React from 'react';
import './BeforeLogin.css';
import logo from '../assets/sutbranding2.jpg';
import backgroundVideo from '../assets/loginbackground.mp4';

interface BeforeLoginProps {
  onLoginClick: () => void;
}

const BeforeLogin: React.FC<BeforeLoginProps> = ({ onLoginClick }) => {
  return (
    <div className="app">
      <video autoPlay loop muted className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="โลโก้" className="logo" />
        </div>
        <input type="text" placeholder="ค้นหารายวิชา" className="search-bar" />
        <div className="header-links">
          <a href="#">รายวิชาทั้งหมด</a>
          <a href="#">สำหรับอาจารย์</a>
          <a href="#">สำหรับนักศึกษา</a>
        </div>
        <div className="language-toggle">
          <span>TH</span> | <span>EN</span>
        </div>
        {/* ใช้ prop onLoginClick เมื่อกดปุ่มนี้ */}
        <button className="login-button" onClick={onLoginClick}>เข้าสู่ระบบ</button>
      </header>
      <main className="main-content">
        <h1>SUT e-Learning</h1>
        <p>ระบบบริหารจัดการเรียนการสอนผ่านเครือข่าย มหาวิทยาลัยเทคโนโลยีสุรนารี</p>
      </main>
    </div>
  );
};

export default BeforeLogin;
