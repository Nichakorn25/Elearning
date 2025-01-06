import React from "react";
import { Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./LoginPopup.css";
import { SignInInterface } from "../../../Interface/IUser";
import { SignIn, GetUserById } from "../../../services/https";

interface LoginPopupProps {
  onClose: () => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: SignInInterface) => {
    let res = await SignIn(values);

    if (res.status === 200) {
      messageApi.success("Sign-in Successful");

      localStorage.setItem("isLogin", "true");
      localStorage.setItem("token_type", res.data.token_type);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("id", res.data.id);

      const userId = res.data.id;
      let userResponse = await GetUserById(userId);

      if (userResponse.status === 200) {
        const user = userResponse.data;
        localStorage.setItem("role", user.RoleID.toString());
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: user.Username,
            FirstName: user.FirstName,
            LastName: user.LastName,
          })
        );
        setTimeout(() => {
          if (user.RoleID === 1) {
            message.success("You are a student!");
            navigate("/Dashboard");
          } else if (user.RoleID === 2) {
            message.success("You are a teacher!");
            navigate("/Dashboard");
          } else if (user.RoleID === 3) {
            message.success("You are an Admin!");
            navigate("/Dashboard");
          }
        }, 1000);
      } else {
        messageApi.error("Failed to retrieve user data");
      }
    } else {
      messageApi.error(res.data.error);
    }
  };

  const handleForgotPassword = () => {
    onClose();
    navigate("/ForgotPassword");
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      {contextHolder}
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        {/* Left Section - Login Form */}
        <div className="popup-form-container">
          <h2>Log In</h2>
          <Form
            name="login"
            onFinish={onFinish}
            className="popup-form"
            requiredMark={false}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                type="text"
                placeholder="Username"
                className="popup-input-field"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input.Password
                type="password"
                placeholder="Password"
                className="popup-input-field"
              />
            </Form.Item>
            <div className="popup-form-actions">
              {/* <div className="remember-me">
                <Input type="checkbox" id="remember-me" />
                <label htmlFor="remember-me">Remember me</label>
              </div> */}
              <a
                href="#"
                className="forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  handleForgotPassword();
                }}
              >
                Forgot password?
              </a>
            </div>
            <button className="popup-login-button" type="submit">
              Sign In
            </button>
          </Form>
        </div>

        {/* Right Section - Welcome Section */}
        <div className="popup-right-panel">
          <h2>Welcome to SE e-Learning!</h2>
          <p>
            Register with your personal details to use all the features of our
            site.
          </p>
          <button
            className="popup-panel-button"
            onClick={() => navigate("/Signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
