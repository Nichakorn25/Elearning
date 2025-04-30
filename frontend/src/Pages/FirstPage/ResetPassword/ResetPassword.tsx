import React, { useState } from "react";
import "./ResetPassword.css"; // Import CSS

const ResetPassword = () => {
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // API Call Logic
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