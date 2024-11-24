import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPopup.css';

interface LoginPopupProps {
  onClose: () => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // ปิด Popup
    onClose();
    // นำทางไปยังหน้า Dashboard
    navigate('/dashboard');
  };

  const handleForgotPassword = () => {
    // ปิด Popup
    onClose();
    // นำทางไปยังหน้า ForgotPassword
    navigate('/ForgotPassword');
  };

  const handleSignUp = () => {
    // ปิด Popup
    onClose();
    // นำทางไปยังหน้า ForgotPassword
    navigate('/SignUp');
  };


  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <h2>SUT e-Learning</h2>
        <input type="text" placeholder="Username" className="input-field" />
        <input type="password" placeholder="Password" className="input-field" />
        <button className="sign-in-btn" onClick={handleLogin}>Sign in</button>
        <div className="social-login">
          <button className="facebook-btn">Sign in with Facebook</button>
          <button className="google-btn">Sign in with Google</button>
        </div>
        <div className="links">
          {/* เพิ่ม onClick ที่ลิงก์ "ลืมรหัสผ่าน" */}
          <a href="#" onClick={handleForgotPassword}>ลืมรหัสผ่าน</a> | <a href="#" onClick={handleSignUp}>สมัครสมาชิก</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
