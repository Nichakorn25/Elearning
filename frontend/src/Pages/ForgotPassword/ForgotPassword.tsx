import React, { useState } from "react";
import "./ForgotPassword.css"; // Import CSS

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // API Call Logic
  };

  return (
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
    </div>
  );
};

export default ForgotPassword;
