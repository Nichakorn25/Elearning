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
      {/* วิดีโอพื้นหลัง */}
      <video autoPlay loop muted className="backgroundbeforelogin-video">
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      {/* ส่วนหัว */}
      <header className="headerbeforelogin">
        {/* โลโก้ */}
        <div className="logo-container">
          <img src={logo} alt="โลโก้" className="logo" />
        </div>

        {/* ช่องค้นหา */}
        <input
          type="text"
          placeholder="ค้นหารายวิชา"
          className="search-barbeforelogin"
        />

        {/* ลิงก์เมนู */}
        <div className="header-links">
          <a href="#">รายวิชาทั้งหมด</a>
          <a href="#">สำหรับอาจารย์</a>
          <a href="#">สำหรับนักศึกษา</a>
        </div>

        {/* ตัวเลือกภาษา */}
        <div className="language-toggle">
          <span>TH</span> | <span>EN</span>
        </div>

        {/* ปุ่มเข้าสู่ระบบ */}
        <button className="login-button" onClick={onLoginClick}>
          เข้าสู่ระบบ
        </button>
      </header>

      {/* เนื้อหาหลัก */}
      <main className="main-content">
        <h1>SUT e-Learning</h1>
        <p>ระบบบริหารจัดการเรียนการสอนผ่านเครือข่าย มหาวิทยาลัยเทคโนโลยีสุรนารี</p>
      </main>
    </div>
  );
};

export default BeforeLogin;
