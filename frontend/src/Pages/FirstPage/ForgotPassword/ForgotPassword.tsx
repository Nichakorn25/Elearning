import React from "react";
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";
import video from "../../../assets/loginbackground.mp4";
import { Form, Input, message } from "antd";
import { UserInterface } from "../../../Interface/IUser";
import { ResetPassword } from "../../../services/https/index";
import HeaderBeforeLogin from "../../Component/HeaderBeforeLogin/HeaderBeforeLogin"; // Import Header ที่แยกไว้

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
      <div className="forget-container">
        <div className="forget-box">
          <h1 className="textSize">Reset Password</h1>
          <Form
            style={{ margin: "0px" }}
            name="resetPassword"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              style={{ margin: "0px" }}
              name="username"
              label={
                <span
                  style={{
                    color: "#ffff",
                    fontSize: "15px",
                    fontFamily: "fantasy",
                    margin: "0px",
                  }}
                >
                  USERNAME
                </span>
              }
              rules={[
                { required: true, message: "Please enter your username" },
              ]}
            >
              <Input placeholder="Username" className="form-groupF" />
            </Form.Item>

            <Form.Item
              style={{ margin: "0px" }}
              name="email"
              label={
                <span
                  style={{
                    color: "#ffff",
                    fontSize: "15px",
                    fontFamily: "fantasy",
                    margin: "0px",
                  }}
                >
                  Email
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please enter your email",
                  type: "email",
                },
              ]}
            >
              <Input placeholder="Email" className="form-groupF" />
            </Form.Item>

            <Form.Item
              style={{ margin: "0px" }}
              name="password"
              label={
                <span
                  style={{
                    color: "#ffff",
                    fontSize: "15px",
                    fontFamily: "fantasy",
                    margin: "0px",
                  }}
                >
                  NEW PASSWORD
                </span>
              }
              rules={[
                { required: true, message: "Please enter your new password" },
              ]}
            >
              <Input.Password
                placeholder="New Password"
                className="form-groupF"
              />
            </Form.Item>

            <Form.Item
              style={{ margin: "0px" }}
              name="confirmPassword"
              label={
                <span
                  style={{
                    color: "#ffff",
                    fontSize: "15px",
                    fontFamily: "fantasy",
                    margin: "0px",
                  }}
                >
                  CONFIRM PASSWORD
                </span>
              }
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirm Password"
                className="form-groupF"
              />
            </Form.Item>

            <Form.Item>
              <button className="confirm-button">CONFIRM</button>
            </Form.Item>
          </Form>
          <a href="/beforeLogin" className="signup-link">
            BACK TO LOGIN
          </a>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
