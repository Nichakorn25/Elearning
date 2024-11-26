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

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault(); // ป้องกัน reload หน้า
    onClose();
    navigate('/ForgotPassword'); // นำทางไปยังหน้า ForgotPassword
  };

  const handleSignUp = (e: React.MouseEvent) => {
    e.preventDefault(); // ป้องกัน reload หน้า
    onClose();
    navigate('/SignUp'); // นำทางไปยังหน้า SignUp
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <h2>SUT e-Learning</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <button className="sign-in-btn" onClick={handleLogin}>
          Sign in
        </button>
        <div className="links">
          <a href="#" onClick={handleForgotPassword}>
            ลืมรหัสผ่าน
          </a>{' '}
          |{' '}
          <a href="#" onClick={handleSignUp}>
            สมัครสมาชิก
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
