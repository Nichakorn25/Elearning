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
import ResetPassword from './Pages/FirstPage/ResetPassword/ResetPassword';
import VerifyOTP from './Pages/FirstPage/VerifyOTP/VerifyOTP';
import ForgotPassword from './Pages/FirstPage/ForgotPassword/ForgotPassword';
import AllCourse from './Pages/FirstPage/AllCourse/AllCourse';
import ForTeacher from './Pages/FirstPage/ForTeacher/ForTeacher';
import ForStudent from './Pages/FirstPage/ForStudent/ForStudent';
import RequestChangeRole from './Pages/RequestChangeRole/RequestChangeRole';
import SignUp from './Pages/FirstPage/SignUp/SignUp';
import CreateCourse from "./Pages/CreateCourse/CreateCourse";
import TeacherCalendar from "./Pages/Appointment/Teacher/TeacherCalendar/TCcalendar"
import StudentCalendar from "./Pages/Appointment/Student/StudentCalendar/StudentCalendar"
import Admin from './Pages/Admin/Admin';
import AdminFillDetails from './Pages/AdminFillDetails/AdminFillDetails';
import Announcement from './Pages/Announcement/Announcement'
import ConfirmTransfer from './Pages/ConfirmTransfer/ConfirmTransfer';
import ManageRoleRequests from './Pages/ManageRoleRequests/ManageRoleRequests';
import ProtectedRoute from './Pages/Component/ProtectedRoute/ProtectedRoute'; // Import ProtectedRoute

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
          <Route path="/Admin"element={<ProtectedRoute> <Admin /></ProtectedRoute> } />
          <Route path="/AdminFillDetails" element={<ProtectedRoute><AdminFillDetails /></ProtectedRoute>} />
          <Route path="/Announcement"element={<ProtectedRoute> <Announcement /></ProtectedRoute> } />
          <Route path="/ConfirmTransfer" element={<ProtectedRoute> <ConfirmTransfer /></ProtectedRoute>} />
          <Route path="/ManageRoleRequests" element={<ProtectedRoute> <ManageRoleRequests /></ProtectedRoute>} />
          <Route path="/buySheet" element={<BuySheet />} />
          <Route path="/selectsheet" element={<SelectSheet />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/ResetPassword" element={<ResetPassword/>}/>
          <Route path="/VerifyOTP" element={<VerifyOTP/>}/>
          <Route path="/ForgotPassword" element={<ForgotPassword/>}/>
          <Route path="/AllCourse" element={<AllCourse/>}/>
          <Route path="/ForTeacher" element={<ForTeacher/>}/>
          <Route path="/ForStudent" element={<ForStudent/>}/>
          <Route path="/RequestChangeRole" element={<RequestChangeRole/>}/>
          <Route path="/SignUp" element={<SignUp/>}/>
          <Route path="/CreateCourse" element={<CreateCourse/>}/>
          <Route path="/TeacherCalendar" element={<TeacherCalendar/>}/>
          <Route path="/StudentCalendar" element={<StudentCalendar/>}/>
          <Route path="/ClassSchedule" element={<ClassSchedule/>}/>

        </Routes>

        {/* แสดง LoginPopup เมื่อ isPopupOpen เป็น true */}
        {isPopupOpen && <LoginPopup onClose={togglePopup} />}
      </div>
    </Router>
  );
};

export default App;
