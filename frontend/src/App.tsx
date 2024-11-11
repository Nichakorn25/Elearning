import React, { useState } from 'react';
import BeforeLogin from './BeforeLogin/BeforeLogin';
import LoginPopup from './LoginPopup/LoginPopup';

const App: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // ฟังก์ชันสำหรับเปิดและปิดป๊อปอัพ
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div>
      {/* ส่งฟังก์ชัน togglePopup เป็น prop ไปที่ BeforeLogin */}
      <BeforeLogin onLoginClick={togglePopup} />

      {/* แสดง LoginPopup เมื่อ isPopupOpen เป็น true */}
      {isPopupOpen && <LoginPopup onClose={togglePopup} />}
    </div>
  );
};

export default App;
