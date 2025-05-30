import React, { useState } from "react";
import { Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./LoginPopup.css";
import { SignInInterface } from "../../../Interface/IUser";
import { SignIn, GetUserById } from "../../../services/https";
import Loading from "../../Component/Loading/Loading";
import simpleAvatar from "../../../assets/cat.png"

interface LoginPopupProps {
  onClose: () => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false); // เพิ่มสถานะ loading

  const onFinish = async (values: SignInInterface) => {
    setLoading(true); // เริ่มหน้าจอโหลด
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
          messageApi.error(
            "Your account is inactive. Please contact the administrator."
          );
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
        const profilePictureUrl = userResponse.data.ProfilePicture?.[0]
          ?.FilePath
          ? `http://api.se-elearning.online${userResponse.data.ProfilePicture[0].FilePath}`
          : simpleAvatar;
        localStorage.setItem("profilePicture", profilePictureUrl);
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
          onClose(); // ปิด Popup หลังจาก login สำเร็จ
        }, 1000);
      } else {
        messageApi.error("Failed to retrieve user data");
      }
    } else {
      messageApi.error(res.data.error);
    }
  };

  const handleForgotPassword = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/ForgotPassword");
      setLoading(false);
      onClose(); // ปิด Popup หลังจากกด
    }, 1000);
  };

  const handleSignUp = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/Signup");
      setLoading(false);
      onClose(); // ปิด Popup หลังจากกด
    }, 1000);
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      {contextHolder}
      {loading ? ( // แสดง Loading Animation
        <Loading />
      ) : (
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
              ลงทะเบียนเพื่อเริ่มต้นการเรียนรู้และเข้าถึงคอร์สเรียนที่หลากหลาย
              พร้อมฟีเจอร์ครบครันที่จะช่วยพัฒนาทักษะของคุณได้อย่างเต็มที่ได้ที่นี่
            </p>
            <button className="popup-panel-button" onClick={handleSignUp}>
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPopup;