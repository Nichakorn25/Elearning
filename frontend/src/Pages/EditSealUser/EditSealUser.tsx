import React, { useState, useEffect } from 'react';
import { Card, Layout, Button, Input, Form, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Component/Sidebar/Sidebar';
import Header from '../Component/Header/Header';
import './EditSealUser.css';

const { Content } = Layout;
const { Option } = Select;

const getUserData = async () => {
  return {
    username: 'user123',
    email: 'user123@example.com',
    phoneNumber: '0812345678',
    password: 'password123',
    bank: 'ธนาคารกรุงเทพ',
    accountNumber: '1234567890'
  };
};

const EditSealUser = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserData();
      form.setFieldsValue(data);
    };
    fetchData();
  }, [form]);

  const handleUpdateUser = async () => {
    try {
      const values = await form.validateFields();
      console.log('Received values of form: ', values);
      message.success('ผู้ใช้ถูกอัปเดตเรียบร้อยแล้ว!');
      navigate('/MainSealSheet');
    } catch (errorInfo) {
      console.error('Failed:', errorInfo);
    }
  };

  return (
    <Layout className="editsealer">
      <Header />
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
      <Content className="editsealer-content">
        <Card className="form-container" title="แก้ไขผู้ใช้" bordered={false}>
          <Form form={form} layout="vertical" onFinish={handleUpdateUser}>
            <Form.Item
              label="ชื่อผู้ใช้"
              name="username"
              rules={[{ required: true, message: 'กรุณากรอกชื่อผู้ใช้' }]}
            >
              <Input placeholder="กรอกชื่อผู้ใช้" />
            </Form.Item>
            <Form.Item
              label="อีเมล"
              name="email"
              rules={[{ required: true, message: 'กรุณากรอกอีเมล' }]}
            >
              <Input placeholder="กรอกอีเมล" />
            </Form.Item>
            <Form.Item
              label="เบอร์โทรศัพท์"
              name="phoneNumber"
              rules={[{ required: true, message: 'กรุณากรอกเบอร์โทรศัพท์' }]}
            >
              <Input placeholder="กรอกเบอร์โทรศัพท์" />
            </Form.Item>
            <Form.Item
              label="รหัสผ่าน"
              name="password"
              rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน' }]}
            >
              <Input.Password placeholder="กรอกรหัสผ่าน" />
            </Form.Item>
            <Form.Item
              label="เลือกธนาคาร"  
              name="bank"
              rules={[{ required: true, message: 'กรุณาเลือกธนาคาร' }]}
            >
              <Select placeholder="เลือกธนาคาร" defaultValue="ธนาคารกรุงเทพ">
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
              <Input placeholder="กรอกเลขบัญชีธนาคาร" />
            </Form.Item>
            <Form.Item className="form-button-item">
              <Button type="primary" htmlType="submit">
                อัปเดตผู้ใช้
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default EditSealUser;
