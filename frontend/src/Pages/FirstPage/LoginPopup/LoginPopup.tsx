import React from 'react';
import { Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './LoginPopup.css';
import { SignInInterface } from '../../../Interface/IUser';
import { SignIn, GetUserById } from '../../../services/https';

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

        setTimeout(() => {
          if (user.RoleID === 1) {
            message.success("You are a student!");
            navigate("/Dashboard");
          } 
          else if (user.RoleID === 2) {
            message.success("You are a teacher!");
            navigate("/Dashboard");
          } 
          else if (user.RoleID === 3)  {
            message.success("You are an Admin!")
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

  return (
    <div className="popup-overlay" onClick={onClose}>
      {contextHolder}
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <h2>SUT e-Learning</h2>
        <Form
          name="login"
          onFinish={onFinish}
          className="popup-form"
          requiredMark={false}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter your Username!' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your Password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <button className="popup-login-button" type="submit">
              เข้าสู่ระบบ
            </button>
          </Form.Item>
        </Form>
        <div className="popup-links">
          <a href="#" onClick={(e) => { e.preventDefault(); onClose(); navigate('/ForgotPassword'); }}>
            ลืมรหัสผ่าน
          </a>{' '}
          |{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onClose(); navigate('/SignUp'); }}>
            สมัครสมาชิก
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
