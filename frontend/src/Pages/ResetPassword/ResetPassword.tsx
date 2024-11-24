import React, { useState } from "react";
import "./ResetPassword.css"; // Import CSS
import { useNavigate } from "react-router-dom";
import HeaderTabBFLogin from "../Component/HeaderTabBFLogin/HeaderTabBFLogin";
import LoginPopup from "../LoginPopup/LoginPopup";

const ResetPassword = () => {
  const [password, setPassword] = useState("");

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
    <div className="reset-password-container">
      <HeaderTabBFLogin onLoginClick={handleOpenLoginPopup} />
        <h1>Reset Password</h1>
        <form onSubmit={handleSubmit}>
            <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            <button type="submit">Reset Password</button>
        </form>
        {isLoginPopupVisible && <LoginPopup onClose={closeLoginPopup} />}
    </div>

  );
};

export default ResetPassword;
