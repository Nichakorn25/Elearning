import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BeforeLogin from './Pages/FirstPage/BeforeLogin/BeforeLogin';
import LoginPopup from './Pages/FirstPage/LoginPopup/LoginPopup';
import Dashboard from '../src/Pages/Dashboard/Dashboard';
import BuySheet from '../src/Pages/Buysheet/Buysheet';
import SelectSheet from '../src/Pages/SelectSheet/SelectSheet';
import Cart from '../src/Pages/Cart/Cart';
import ClassSchedule from './Pages/Planner/ClassSchedule/ClassSchedule';
import TeacherCalendar from './Pages/Appointment/Teacher/TeacherCalendar/TeacherCalendar';
// import CreateAppointment from './Pages/Appointment/Teacher/CreateAppointment/CreateAppointment';
import StudentCalendar from './Pages/Appointment/Student/StudentCalendar/StudentCalendar';
import ResetPassword from './Pages/FirstPage/ResetPassword/ResetPassword';
import VerifyOTP from './Pages/FirstPage/VerifyOTP/VerifyOTP';
import ForgotPassword from './Pages/FirstPage/ForgotPassword/ForgotPassword';
import AllCourse from './Pages/FirstPage/AllCourse/AllCourse';
import ForTeacher from './Pages/FirstPage/ForTeacher/ForTeacher';
import ForStudent from './Pages/FirstPage/ForStudent/ForStudent';
import RequestChangeRole from './Pages/RequestChangeRole/RequestChangeRole';
import SignUp from './Pages/FirstPage/SignUp/SignUp';
import CreateCourse from "./Pages/CreateCourse/CreateCourse";
import MangeCourse from "./Pages/ManageCourse/ManageCourse";
import StudentBooking from './Pages/Appointment/Student/StudentBooking/StudentBooking';
import Profile from '../src/Pages/Profile/Profile'; 
import EditProfile from './Pages/Profile/edit/EditProfile';
import Admin from './Pages/Admin/Admin';
import AdminFillDetails from './Pages/AdminFillDetails/AdminFillDetails';
import Announcement from './Pages/Announcement/Announcement'
import ConfirmTransfer from './Pages/ConfirmTransfer/ConfirmTransfer';
import ManageRoleRequests from './Pages/ManageRoleRequests/ManageRoleRequests';
import ManageUsers from "./Pages/ManageUsers/ManageUsers";
import ProtectedRoute from './Pages/Component/ProtectedRoute/ProtectedRoute'; // Import ProtectedRoute
import EditSheet from './Pages/EditSheet/EditSheet';
import IncomeHistory from './Pages/IncomeHistory/IncomeHistory';
import Payment from './Pages/Payment/Payment';
import MainSealSheet from './Pages/MainSealSheet/MainSealSheet';
import CheckSeller from './Pages/CheckSeller/ChechSeller';
import AddSheet from './Pages/AddSheet/AddSheet';
import EditSealUser from './Pages/EditSealUser/EditSealUser';
import AddSealUser from './Pages/AddSealUser/AddSealUser';
import StudentProtectedRoute from './Pages/Component/ProtectedRoute/StudentProtectedRoute';
import TeacherAppointment from './Pages/Appointment/Teacher/TeacherAppointment/TeacherAppointment';
import StudentAppointment from './Pages/Appointment/Student/StudentAppointment/StudentAppointment';


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
          <Route path="/EditProfile" element={<EditProfile />} />
          <Route path="/Admin"element={<ProtectedRoute> <Admin /></ProtectedRoute> } />
          <Route path="/AdminFillDetails" element={<ProtectedRoute><AdminFillDetails /></ProtectedRoute>} />
          <Route path="/Announcement"element={<ProtectedRoute> <Announcement /></ProtectedRoute> } />
          <Route path="/ConfirmTransfer" element={<ProtectedRoute> <ConfirmTransfer /></ProtectedRoute>} />
          <Route path="/ManageRoleRequests" element={<ProtectedRoute> <ManageRoleRequests /></ProtectedRoute>} />
          <Route path="/ManageUsers" element={<ProtectedRoute> <ManageUsers /></ProtectedRoute>} />
          <Route path="/buySheet" element={<BuySheet />} />
          <Route path="//SelectSheet/:id" element={<SelectSheet />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/ClassSchedule" element={<ClassSchedule />}/>
          <Route path="/TeacherCalendar" element={<TeacherCalendar/>}/>
          <Route path="/TeacherAppointment" element={<TeacherAppointment/>}/>
          <Route path="/StudentAppointment" element={<StudentAppointment/>}/>
          {/* <Route path="/CreateAppointment" element={<CreateAppointment/>}/> */}
          <Route path="/StudentCalendar" element={<StudentProtectedRoute><StudentCalendar/></StudentProtectedRoute>}/>
          <Route path="/ResetPassword" element={<ResetPassword/>}/>
          <Route path="/VerifyOTP" element={<VerifyOTP/>}/>
          <Route path="/ForgotPassword" element={<ForgotPassword/>}/>
          <Route path="/AllCourse" element={<AllCourse/>}/>
          <Route path="/ForTeacher" element={<ForTeacher/>}/>
          <Route path="/ForStudent" element={<ForStudent/>}/>
          <Route path="/RequestChangeRole" element={<RequestChangeRole/>}/>
          <Route path="/SignUp" element={<SignUp/>}/>
          <Route path="/CreateCourse" element={<CreateCourse/>}/>
          <Route path="/ManageCourse" element={<MangeCourse/>}/>
          <Route path="/StudentBooking" element={<StudentProtectedRoute><StudentBooking/></StudentProtectedRoute>}/>
          <Route path="/EditSheet/:id" element={<EditSheet />} />
          <Route path="/IncomeHistory" element={<IncomeHistory />} />
          <Route path="/Payment" element={<Payment />} />
          <Route path="/CheckSeller" element={<CheckSeller />} /> 
          <Route path="/MainSealSheet" element={<MainSealSheet />} />
          <Route path="/AddSheet" element={<AddSheet />} />
          <Route path="/EditSealUser" element={<EditSealUser />} />
          <Route path="/AddSealUser" element={<AddSealUser />} /> 
        </Routes>

        {/* แสดง LoginPopup เมื่อ isPopupOpen เป็น true */}
        {isPopupOpen && <LoginPopup onClose={togglePopup} />}
      </div>
    </Router>
  );
};

export default App;
