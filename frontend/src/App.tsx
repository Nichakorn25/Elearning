import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BeforeLogin from '../src/Pages/BeforeLogin/BeforeLogin';
import LoginPopup from '../src/Pages/LoginPopup/LoginPopup';
import Dashboard from '../src/Pages/Dashboard/Dashboard';
import Profile from '../src/Pages/Profile/Profile'; // นำเข้า Profile
import BuySheet from '../src/Pages/Buysheet/Buysheet';
import SelectSheet from '../src/Pages/SelectSheet/SelectSheet';
import Cart from '../src/Pages/Cart/Cart';
import ClassSchedule from '../src/Pages/ClassSchedule/ClassSchedule';
import Appointment from './Pages/Appointment/Appointment';

const App: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <Router>
      <div>
        <Routes>
          {/* เปลี่ยนเส้นทางของ BeforeLogin ให้เป็น path="/" */}
          <Route path="/" element={<BeforeLogin onLoginClick={togglePopup} />} />
          {/* เส้นทางสำหรับ Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* เส้นทางสำหรับ Profile */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/buySheet" element={<BuySheet />} />
          <Route path="/selectsheet" element={<SelectSheet />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/ClassSchedule" element={<ClassSchedule />} />
          <Route path="/Appointment" element={<Appointment/>}/>
        </Routes>

        {/* แสดง LoginPopup เมื่อ isPopupOpen เป็น true */}
        {isPopupOpen && <LoginPopup onClose={togglePopup} />}
      </div>
    </Router>
  );
};

export default App;
