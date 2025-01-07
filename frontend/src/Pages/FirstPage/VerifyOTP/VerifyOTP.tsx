import React, { useState } from "react";
import "./VerifyOTP.css";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // ตรวจสอบ OTP ที่กรอก
      const response = await fetch("http://localhost:5000/verify_otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });

      if (response.ok) {
        alert("ยืนยัน OTP สำเร็จ!");
        navigate("/reset-password"); // ไปยังหน้าตั้งรหัสผ่านใหม่
      } else {
        alert("OTP ไม่ถูกต้อง!");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      alert("ไม่สามารถยืนยัน OTP ได้");
    }
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
