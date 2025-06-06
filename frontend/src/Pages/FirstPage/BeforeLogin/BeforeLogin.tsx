import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './BeforeLogin.css';
import backgroundVideo from '../../../assets/loginbackground.mp4'
import HeaderBeforeLogin from '../../Component/HeaderBeforeLogin/HeaderBeforeLogin'; // Import Header ที่แยกไว้
import LoginPopup from '../LoginPopup/LoginPopup';

interface BeforeLoginProps {
  onLoginClick: () => void;
}

const BeforeLogin: React.FC<BeforeLoginProps> = ({ onLoginClick }) => {
  const location = useLocation();
  const [isLoginPopupVisible, setLoginPopupVisible] = useState(false);

  useEffect(() => {
    // ตรวจสอบ state ที่ส่งมาจาก AllCourses.tsx
    if (location.state && location.state.showLoginPopup) {
      setLoginPopupVisible(true);
    }
  }, [location.state]);

  const closeLoginPopup = () => {
    setLoginPopupVisible(false);
  };

  return (
    <div className="BeforeLogin">
      {/* วิดีโอพื้นหลัง */}
      <video autoPlay loop muted className="backgroundbeforelogin-video">
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      {/* ส่วน Header */}
      <HeaderBeforeLogin onLoginClick={onLoginClick} />

      {/* เนื้อหาหลัก */}
      <main className="main-contentbeforelogin">
        <h1 className="h1bflogin">SE e-Learning</h1>
        <p>แพลตฟอร์มบริหารจัดการการเรียนการสอนออนไลน์ที่ออกแบบมาเพื่อสนับสนุนการศึกษา </p>
        <p>การพัฒนาทักษะ และการเรียนรู้ตลอดชีวิตสำหรับผู้เรียนทุกระดับ</p>
      </main>
      {/* แสดง LoginPopup หากเปิด */}
      {isLoginPopupVisible && <LoginPopup onClose={closeLoginPopup} />}
    </div>
  );
};

export default BeforeLogin;