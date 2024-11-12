import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BeforeLogin from './BeforeLogin/BeforeLogin';
import LoginPopup from './LoginPopup/LoginPopup';
import Dashboard from './Dashboard/Dashboard';

const App: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <Router>
      <div>
        <Routes>
          {/* กำหนดให้ BeforeLogin เป็นหน้าแรก */}
          <Route path="/" element={<BeforeLogin onLoginClick={togglePopup} />} />
          {/* กำหนดเส้นทางสำหรับ Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

        {/* แสดง LoginPopup เมื่อ isPopupOpen เป็น true */}
        {isPopupOpen && <LoginPopup onClose={togglePopup} />}
      </div>
    </Router>
  );
};

export default App;
