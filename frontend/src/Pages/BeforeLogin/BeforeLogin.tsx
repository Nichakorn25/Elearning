import React from 'react';
import './BeforeLogin.css';
import logo from '../../assets/sutbranding2.jpg';
import backgroundVideo from '../../assets/loginbackground.mp4';

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
          <a href="#">รายวิชาทั้งหมด</a>
          <a href="#">สำหรับอาจารย์</a>
          <a href="#">สำหรับนักศึกษา</a>
        </div>

        {/* ปุ่มเข้าสู่ระบบ */}
        <button className="login-buttonbeforelogin" onClick={onLoginClick}>
          เข้าสู่ระบบ
        </button>
      </header>

      {/* เนื้อหาหลัก */}
      <main className="main-contentbeforelogin">
        <h1>SUT e-Learning</h1>
        <p>ระบบบริหารจัดการเรียนการสอนผ่านเครือข่าย มหาวิทยาลัยเทคโนโลยีสุรนารี</p>
      </main>
    </div>
  );
};

export default BeforeLogin;
