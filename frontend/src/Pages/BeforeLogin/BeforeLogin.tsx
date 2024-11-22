import React from 'react';
import './BeforeLogin.css';
import backgroundVideo from '../../assets/loginbackground.mp4';
import HeaderBeforeLogin from '../Component/HeaderBeforeLogin/HeaderBeforeLogin'; // Import Header ที่แยกไว้

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

      {/* ส่วน Header */}
      <HeaderBeforeLogin onLoginClick={onLoginClick} />

      {/* เนื้อหาหลัก */}
      <main className="main-contentbeforelogin">
        <h1>SUT e-Learning</h1>
        <p>ระบบบริหารจัดการเรียนการสอนผ่านเครือข่าย มหาวิทยาลัยเทคโนโลยีสุรนารี</p>
      </main>
    </div>
  );
};

export default BeforeLogin;
