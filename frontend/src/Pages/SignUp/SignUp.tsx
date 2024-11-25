import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderTabBFLogin from "../Component/HeaderTabBFLogin/HeaderTabBFLogin";
import "./SignUp.css";

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
    <HeaderTabBFLogin onLoginClick={() => navigate("/BeforeLogin")} />
    <div className="signup-container">
      <h1 className="signup-title">Sign Up</h1>
      <form className="signup-form">
        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <select id="department" name="department" required>
            <option value="">Select Department</option>
            {/* Options for departments will be here */}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="major">Major:</label>
          <select id="major" name="major" required>
            <option value="">Select Major</option>
            {/* Options for majors will be here */}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
          />
        </div>

        <button type="submit" className="signup-submit">
          Sign Up
        </button>
      </form>
    </div>
    </>
  );
};

export default SignUp;
