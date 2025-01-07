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
      const userId = res.data.id;
      localStorage.setItem("token_type", res.data.token_type);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("id", userId);
  
      let userResponse = await GetUserById(userId);
  
      if (userResponse.status === 200) {
        const user = userResponse.data;
  
        // Check if the user's status is Inactive
        if (user.Status === "Inactive") {
          messageApi.error("Your account is inactive. Please contact the administrator.");
          localStorage.clear(); // Clear any stored data since the login is not allowed
          return;
        }
  
        // Proceed if the user is active
        messageApi.success("Sign-in Successful");
        localStorage.setItem("role", user.RoleID.toString());
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: user.Username,
            FirstName: user.FirstName,
            LastName: user.LastName,
          })
        );
        const profilePictureUrl = userResponse.data.ProfilePicture?.[0]?.FilePath
            ? `http://localhost:8000${userResponse.data.ProfilePicture[0].FilePath}`
            : 'https://via.placeholder.com/120';
        localStorage.setItem('profilePicture', profilePictureUrl);
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
        <h2 className="popup-title">SUT e-Learning</h2>
        <Form
          name="login"
          onFinish={onFinish}
          className="popup-form"
          requiredMark={false}
        >
          <div className="input-box">
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                type="text"
                placeholder="Username"
                className="input-field"
              />
            </Form.Item>
            <i className="bx bxs-user input-icon"></i>
          </div>
          <div className="input-box">
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input.Password
                type="password"
                placeholder="Password"
                className="input-field"
              />
            </Form.Item>
            <i className="bx bxs-lock-alt input-icon"></i>
          </div>
          <div className="remember-forgot-box">
            <div className="remember-me">
              <Input type="checkbox" id="remember-me" />
              <label htmlFor="remember-me">Remember me</label>
            </div>
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
            Login
          </button>
          <div className="dont-have-account">
            Don't have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/Signup");
              }}
            >
              Register
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPopup;
