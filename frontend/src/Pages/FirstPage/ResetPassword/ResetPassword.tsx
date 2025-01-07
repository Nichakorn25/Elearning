import React, { useState } from "react";
import "./ResetPassword.css";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      alert("กรุณากรอกรหัสผ่านใหม่!");
      return;
    }

    try {
      // เรียก API เพื่อตั้งรหัสผ่านใหม่
      const response = await fetch("http://localhost:5000/reset_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        alert("ตั้งรหัสผ่านใหม่สำเร็จ!");
        navigate("/login"); // กลับไปยังหน้าเข้าสู่ระบบ
      } else {
        alert("ไม่สามารถตั้งรหัสผ่านใหม่ได้!");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      alert("การตั้งรหัสผ่านใหม่ล้มเหลว");
    }
  };

  return (
    <div className="reset-password-container">
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
    </div>
  );
};

export default ResetPassword;
