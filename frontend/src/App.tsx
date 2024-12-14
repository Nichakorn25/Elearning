import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BeforeLogin from './Pages/FirstPage/BeforeLogin/BeforeLogin';
import LoginPopup from './Pages/FirstPage/LoginPopup/LoginPopup';
import Dashboard from '../src/Pages/Dashboard/Dashboard';
import Profile from '../src/Pages/Profile/Profile'; // นำเข้า Profile
import BuySheet from '../src/Pages/Buysheet/Buysheet';
import SelectSheet from '../src/Pages/SelectSheet/SelectSheet';
import Cart from '../src/Pages/Cart/Cart';
import ClassSchedule from './Pages/Planner/ClassSchedule/ClassSchedule';
//import Appointment from './Pages/Appointment/Appointment';
import ResetPassword from './Pages/FirstPage/ResetPassword/ResetPassword';
import VerifyOTP from './Pages/FirstPage/VerifyOTP/VerifyOTP';
import ForgotPassword from './Pages/FirstPage/ForgotPassword/ForgotPassword';
import AllCourse from './Pages/FirstPage/AllCourse/AllCourse';
import ForTeacher from './Pages/FirstPage/ForTeacher/ForTeacher';
import ForStudent from './Pages/FirstPage/ForStudent/ForStudent';
import RequestChangeRole from './Pages/RequestChangeRole/RequestChangeRole';
import SignUp from './Pages/FirstPage/SignUp/SignUp';
import CalendarComponent from './Pages/Appointment/CalendarComponent';
//import TeacherCalendar from './Pages/Appointment/Teacher/TeacherCalendar/TeacherCalendar';
import TCcalendar from './Pages/Appointment/Teacher/Test/TCcalendar';

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
          <Route path="/beforeLogin" element={<Navigate to="/" replace />} />

          {/* เส้นทางสำหรับ Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* เส้นทางสำหรับ Profile */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/buySheet" element={<BuySheet />} />
          <Route path="/selectsheet" element={<SelectSheet />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/ClassSchedule" element={<ClassSchedule />} />
          {/* <Route path="/Appointment" element={<Appointment/>}/> */}
          <Route path="/ResetPassword" element={<ResetPassword/>}/>
          <Route path="/VerifyOTP" element={<VerifyOTP/>}/>
          <Route path="/ForgotPassword" element={<ForgotPassword/>}/>
          <Route path="/AllCourse" element={<AllCourse/>}/>
          <Route path="/ForTeacher" element={<ForTeacher/>}/>
          <Route path="/ForStudent" element={<ForStudent/>}/>
          <Route path="/RequestChangeRole" element={<RequestChangeRole/>}/>
          <Route path="/SignUp" element={<SignUp/>}/>
          {/* <Route path="/TeacherCalendar" element={<TeacherCalendar/>}/> */}
          <Route path="/CalendarComponent" element={<CalendarComponent/>}/>
          <Route path="/TCcalendar" element={<TCcalendar/>}/>

        </Routes>

        {/* แสดง LoginPopup เมื่อ isPopupOpen เป็น true */}
        {isPopupOpen && <LoginPopup onClose={togglePopup} />}
      </div>
    </Router>
  );
};

export default App;
