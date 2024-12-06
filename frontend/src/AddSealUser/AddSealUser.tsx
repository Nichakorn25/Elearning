import React, { useState } from 'react';
import { Card, Layout, Button, Input, Form, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Option } = Select;

const AddSealUser: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [bank, setBank] = useState<string | undefined>(undefined);
  const [accountNumber, setAccountNumber] = useState('');

  // ฟังก์ชันสำหรับการบันทึกข้อมูลผู้ใช้ใหม่
  const handleCreateUser = () => {
    if (!username || !email || !phoneNumber || !password || !bank || !accountNumber) {
      message.warning('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      message.warning('กรุณากรอกอีเมลให้ถูกต้อง');
      return;
    }

    // Validate phone number format (simple validation for 10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      message.warning('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง');
      return;
    }

    // สมมุติว่าเก็บข้อมูลผู้ใช้ได้ที่นี่
    message.success('ผู้ใช้ถูกสร้างเรียบร้อยแล้ว!');
    navigate('/dashboard'); // หลังจากสร้างผู้ใช้เสร็จ, ไปยังหน้า dashboard
  };

  return (
    <Layout className="sheet">
      <header className="sheet-header">
        <div className="header-left">
          <button className="menu-button">☰</button>
          <h1>SUT e-Learning</h1>
          <span className="language">English (en)</span>
        </div>
        <div className="header-right"></div>
      </header>
      <Content className="sheet-content">
        <div className="form-container">
          <Card title="สร้างผู้ใช้ใหม่" bordered={false} className="seal-sheet-card">
            <Form layout="vertical" onFinish={handleCreateUser}>
              <Form.Item
                label="ชื่อผู้ใช้"
                name="username"
                rules={[{ required: true, message: 'กรุณากรอกชื่อผู้ใช้' }]}
              >
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="กรอกชื่อผู้ใช้"
                />
              </Form.Item>
              <Form.Item
                label="อีเมล"
                name="email"
                rules={[{ required: true, message: 'กรุณากรอกอีเมล' }]}
              >
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="กรอกอีเมล"
                />
              </Form.Item>
              <Form.Item
                label="เบอร์โทรศัพท์"
                name="phoneNumber"
                rules={[{ required: true, message: 'กรุณากรอกเบอร์โทรศัพท์' }]}
              >
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="กรอกเบอร์โทรศัพท์"
                />
              </Form.Item>
              <Form.Item
                label="รหัสผ่าน"
                name="password"
                rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน' }]}
              >
                <Input.Password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่าน"
                />
              </Form.Item>
              <Form.Item
                label="เลือกธนาคาร"
                name="bank"
                rules={[{ required: true, message: 'กรุณาเลือกธนาคาร' }]}
              >
                <Select
                  value={bank}
                  onChange={(value) => setBank(value)}
                  placeholder="เลือกธนาคาร"
                >
                  <Option value="ธนาคารกรุงเทพ">ธนาคารกรุงเทพ</Option>
                  <Option value="ธนาคารกสิกรไทย">ธนาคารกสิกรไทย</Option>
                  <Option value="ธนาคารไทยพาณิชย์">ธนาคารไทยพาณิชย์</Option>
                  <Option value="ธนาคารกรุงไทย">ธนาคารกรุงไทย</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="เลขบัญชีธนาคาร"
                name="accountNumber"
                rules={[{ required: true, message: 'กรุณากรอกเลขบัญชีธนาคาร' }]}
              >
                <Input
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="กรอกเลขบัญชีธนาคาร"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  สร้างผู้ใช้
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default AddSealUser;
