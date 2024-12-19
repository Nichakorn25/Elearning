import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BeforeLogin from './BeforeLogin/BeforeLogin';
import LoginPopup from './LoginPopup/LoginPopup';
import Dashboard from './Dashboard/Dashboard';
import Profile from './Profile/Profile'; // นำเข้า Profile
import BuySheet from './Buysheet/Buysheet';
import SelectSheet from './SelectSheet/SelectSheet';
import Cart from './Cart/Cart';

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
          <Route path="/selectsheet" element={<SelectSheet  />} />
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

          <Route path="/AddSealUser" element={<AddSealUser />} /> 
          <Route path="/MainSealSheet" element={<MainSealSheet />} />
          <Route path="/AddSheet" element={<AddSheet />} />
          <Route path="/AddSheet" element={<AddSheet />} />
          <Route path="/EditSealUser" element={<EditSealUser />} />
          <Route path="/EditSheet" element={<EditSheet />} />
          <Route path="/IncomeHistory" element={<IncomeHistory />} />
          <Route path="/Payment" element={<PaymentPage />} />
        </Routes>

        {/* แสดง LoginPopup เมื่อ isPopupOpen เป็น true */}
        {isPopupOpen && <LoginPopup onClose={togglePopup} />}
      </div>
    </Router>
  );
};

export default App;
