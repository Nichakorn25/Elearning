import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BeforeLogin from './Pages/FirstPage/BeforeLogin/BeforeLogin';
import LoginPopup from './Pages/FirstPage/LoginPopup/LoginPopup';
import Dashboard from '../src/Pages/Dashboard/Dashboard';
import Profile from '../src/Pages/Profile/Profile'; 
import EditProfile from './Pages/Profile/edit/EditProfile';
import Admin from './Pages/Admin/Admin';
import AdminFillDetails from './Pages/AdminFillDetails/AdminFillDetails';
import Announcement from './Pages/Announcement/Announcement'
import ConfirmTransfer from './Pages/ConfirmTransfer/ConfirmTransfer';
import ManageRoleRequests from './Pages/ManageRoleRequests/ManageRoleRequests';
import ManageUsers from "./Pages/ManageUsers/ManageUsers";
import RequestChangeRole from './Pages/RequestChangeRole/RequestChangeRole';
import ProtectedRoute from './Pages/Component/ProtectedRoute/ProtectedRoute'; // Import ProtectedRoute
import BuySheet from '../src/Pages/Buysheet/Buysheet';
import SelectSheet from '../src/Pages/SelectSheet/SelectSheet';
import Cart from '../src/Pages/Cart/Cart';
import ResetPassword from './Pages/FirstPage/ResetPassword/ResetPassword';
import VerifyOTP from './Pages/FirstPage/VerifyOTP/VerifyOTP';
import ForgotPassword from './Pages/FirstPage/ForgotPassword/ForgotPassword';
import AllCourse from './Pages/FirstPage/AllCourse/AllCourse';
import CreateCourse from './Pages/CreateCourse/CreateCourse';
import Assignment from './Pages/Assignment/Assignment';
// import AssignmentReview from './Pages/Assignment/AssignmentReview';
import Ateach from './Pages/Assignment/Ateach';
import ManageCourse from './Pages/ManageCourse/ManageCourse';
// import AddSealUser from './Pages/AddSealUser/AddSealUser';
import DashboardforStudent from "./Pages/Dashboard/CouresDashboardforStudent";
import AddSealUser from './Pages/AddSealUser/AddSealUser';
import CheckSeller from './Pages/CheckSeller/ChechSeller';
import GetPurchasedFiles from './Pages/PurchasedFiles/PurchasedFiles';
import IncomeHistory from './Pages/IncomeHistory/IncomeHistory';
import MainSealSheet from './Pages/MainSealSheet/MainSealSheet';
import Payment from './Pages/Payment/Payment';
import TecherProtect from './Pages/Component/ProtectedRoute/TeacherProtectedRoute'
import StudentProtectedRoute from './Pages/Component/ProtectedRoute/StudentProtectedRoute';
import Quiz from './Pages/test/Quiz';
import CreateTest from './Pages/test/CreateTest';
import TestStudent from './Pages/test/TestStudent';
import TeacherCalendar from './Pages/Appointment/Teacher/TeacherCalendar/TeacherCalendar';
import StudentCalendar from './Pages/Appointment/Student/StudentCalendar/StudentCalendar';
import StudentBooking from './Pages/Appointment/Student/StudentBooking/StudentBooking';
import ClassSchedule from './Pages/Planner/ClassSchedule/ClassSchedule';
import StudentAppointment from './Pages/Appointment/Student/StudentAppointment/StudentAppointment';
import TeacherAppointment from './Pages/Appointment/Teacher/TeacherAppointment/TeacherAppointment';
import ForTeacher from './Pages/FirstPage/ForTeacher/ForTeacher';
import ForStudent from './Pages/FirstPage/ForStudent/ForStudent';
import SignUp from './Pages/FirstPage/SignUP/SignUP';
import AssignmentReview from './Pages/Assignment/AssignmentReview';

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
          <Route path="/RequestChangeRole" element={<RequestChangeRole/>}/>
          <Route path="/buySheet" element={<BuySheet />} />
          <Route path="/SelectSheet/:id" element={<SelectSheet />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/ClassSchedule" element={<ClassSchedule />} />
          <Route path="/TeacherCalendar" element={<TecherProtect><TeacherCalendar/></TecherProtect>}/>
          <Route path="/StudentCalendar" element={<StudentProtectedRoute><StudentCalendar/></StudentProtectedRoute>}/>
          <Route path="/TeacherAppointment" element={<TecherProtect><TeacherAppointment/></TecherProtect>}/>
          <Route path="/StudentAppointment" element={<StudentProtectedRoute><StudentAppointment/></StudentProtectedRoute>}/>
          <Route path="/StudentBooking" element={<StudentProtectedRoute><StudentBooking/></StudentProtectedRoute>}/>
          <Route path="/ResetPassword" element={<ResetPassword/>}/>
          <Route path="/Signup" element={<SignUp/>}/>
          <Route path="/VerifyOTP" element={<VerifyOTP/>}/>
          <Route path="/ForgotPassword" element={<ForgotPassword/>}/>
          <Route path="/AllCourse" element={<AllCourse/>}/>
          <Route path="/ForTeacher" element={<ForTeacher/>}/>
          <Route path="/ForStudent" element={<ForStudent/>}/>
          <Route path="/Admin" element={<Admin/>}/>
          <Route path="/CreateCourse" element={<TecherProtect> <CreateCourse/> </TecherProtect>}/>
          <Route path="/assignment_student/:AssignmentID/:CourseID" element={<Assignment />} />
          <Route path="/assignment_teacher/:AssignmentID/:CourseID" element={<Ateach />} />
          <Route path="/assignment_review/:AssignmentID/:CourseID" element={<AssignmentReview />} />
          <Route path="/test_student" element={<TestStudent />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/create_test" element={<CreateTest />} />
          {/* <Route path="/assignment_review" element={<AssignmentReview />} /> */}
          <Route path="/ManageCourse/:id" element={<TecherProtect> <ManageCourse /> </TecherProtect> } />
          <Route path="/DashboardforStudent/:id" element={<DashboardforStudent/>}/>
          <Route path="/AddSealUser" element={<AddSealUser />} /> 
          <Route path="/CheckSeller" element={<CheckSeller />} /> 
          <Route path="/Purchased" element={<GetPurchasedFiles />} />
          <Route path="/IncomeHistory" element={<IncomeHistory />} />
          <Route path="/MainSealSheet" element={<MainSealSheet />} /> 
          <Route path="/Payment" element={<Payment />} /> 
        </Routes>

        {/* แสดง LoginPopup เมื่อ isPopupOpen เป็น true */}
        {isPopupOpen && <LoginPopup onClose={togglePopup} />}
      </div>
    </Router>
  );
};

export default App;