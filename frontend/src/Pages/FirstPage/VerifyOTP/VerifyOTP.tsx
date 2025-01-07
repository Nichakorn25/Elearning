import React, { useState } from "react";
import "./VerifyOTP.css"; // Import CSS

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // API Call Logic
  };

  return (
    <div className="verify-otp-container">
    <h1>Verify OTP</h1>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <button type="submit">Verify OTP</button>
    </form>
  </div>
  
  );
};

export default VerifyOTP;
