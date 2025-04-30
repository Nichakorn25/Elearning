import React from "react";
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";
import video from "../../../assets/loginbackground.mp4";
import { Form, Input, message } from "antd";
import { UserInterface } from "../../../Interface/IUser";
import { ResetPassword } from "../../../services/https/index";
import HeaderBeforeLogin from "../../Component/HeaderBeforeLogin/HeaderBeforeLogin";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: UserInterface) => {
    // ส่งข้อมูลไปที่ API เพื่อรีเซ็ตรหัสผ่าน
    let res = await ResetPassword(values);

    if (res.status === 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });

      // หลังจากรีเซ็ตเสร็จ นำทางไปที่หน้า login
      setTimeout(() => {
        navigate("/beforeLogin");
      }, 1000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  return (
    <>
      <HeaderBeforeLogin onLoginClick={() => navigate("/beforeLogin")} />
      {contextHolder}
      <video autoPlay loop muted playsInline>
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
     <div className="forgot-password-overlay">
  <div className="forgot-password-container">
    <div className="forgot-password-form-container">
      <h2>Reset Password</h2>
      <Form
        name="resetPassword"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="username"
          label={<span className="form-label">USERNAME</span>}
          rules={[{ required: true, message: "Please enter your username" }]}
        >
          <Input
            placeholder="Username"
            className="forgot-password-input-field"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label={<span className="form-label">Email</span>}
          rules={[
            {
              required: true,
              message: "Please enter your email",
              type: "email",
            },
          ]}
        >
          <Input
            placeholder="Email"
            className="forgot-password-input-field"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={<span className="form-label">NEW PASSWORD</span>}
          rules={[
            { required: true, message: "Please enter your new password" },
          ]}
        >
          <Input.Password
            placeholder="New Password"
            className="forgot-password-input-field"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={<span className="form-label">CONFIRM PASSWORD</span>}
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Confirm Password"
            className="forgot-password-input-field"
          />
        </Form.Item>

        <Form.Item>
          <button className="forgot-password-login-button">CONFIRM</button>
        </Form.Item>
      </Form>
      <a
        href="/beforeLogin"
        className="forgot-password-back-to-login"
        style={{ bottom: "20px" }}
      >
        BACK TO LOGIN
      </a>
    </div>
    <div className="forgot-password-right-panel">
      <h2>Welcome to SE e-Learning</h2>
      <p>Explore, Learn, and Achieve Your Goals.</p>
    </div>
  </div>
</div>

    </>
  );
};

export default ForgotPassword;