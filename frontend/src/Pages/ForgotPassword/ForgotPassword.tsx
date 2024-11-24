import React, { useState } from "react";
import "./ForgotPassword.css"; // Import CSS
import { useNavigate } from "react-router-dom";
import LoginPopup from "../LoginPopup/LoginPopup";
import HeaderTabBFLogin from "../Component/HeaderTabBFLogin/HeaderTabBFLogin";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // API Call Logic
  };

  const [isLoginPopupVisible, setLoginPopupVisible] = useState(false);
  const navigate = useNavigate();

  // ฟังก์ชันแสดง Popup
  const handleOpenLoginPopup = () => {
    setLoginPopupVisible(true);
  };

  // ฟังก์ชันซ่อน Popup
  const closeLoginPopup = () => {
    setLoginPopupVisible(false);
  };

  return (
    <>
    <HeaderTabBFLogin onLoginClick={handleOpenLoginPopup} />
    <div className="forgot-password-container">
        <h1>Forgot Password</h1>
        <form onSubmit={handleSubmit}>
            <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
            <button type="submit">Send Reset Link</button>
        </form>
        {isLoginPopupVisible && <LoginPopup onClose={closeLoginPopup} />}
    </div>
    </>
  );
};

export default ForgotPassword;
