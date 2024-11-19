import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BeforeLogin from './BeforeLogin/BeforeLogin';
import LoginPopup from './LoginPopup/LoginPopup';
import Dashboard from './Dashboard/Dashboard';
import Profile from './Profile/Profile'; // นำเข้า Profile
import BuySheet from './Buysheet/Buysheet';
import SelectSheet from './SelectSheet/SelectSheet';
import Cart from './Cart/Cart';
import ClassSchedule from './ClassSchedule/ClassSchedule';

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
          <Route path="/beforelogin" element={<BeforeLogin onLoginClick={togglePopup} />} />
          {/* เส้นทางสำหรับ Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* เส้นทางสำหรับ Profile */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/buySheet" element={<BuySheet />} />
          <Route path="/selectsheet" element={<SelectSheet />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/ClassSchedule" element={<ClassSchedule />} />
        </Routes>

        {/* แสดง LoginPopup เมื่อ isPopupOpen เป็น true */}
        {isPopupOpen && <LoginPopup onClose={togglePopup} />}
      </div>
    </Router>
  );
};

export default App;
