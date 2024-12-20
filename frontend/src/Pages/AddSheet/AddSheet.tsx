import React, { useState } from "react";
import { Button, Typography, Card, Layout, Form, Input, Select, DatePicker, Upload, message } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import Sidebar from '../../Component/Sidebar/Sidebar';
import Header from '../../Component/Header/Header';
import './AddSheet.css';

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const AddSheet: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
    message.success('ชีทได้ถูกเพิ่มแล้ว');
    navigate('/MainSealSheet');
  };

  const beforeUpload = (file: any) => {
    const isPDF = file.type === 'application/pdf';
    if (!isPDF) {
      message.error('คุณสามารถอัพโหลดไฟล์ PDF เท่านั้น!');
      return Upload.LIST_IGNORE;
    }
    return isPDF;
  };

  const onRemove = (file: any) => {
    return true; // Allow file removal
  };

  return (
    <Layout className="sheet">
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
      <Layout>
        <Header />
        <Content className="sealsheet-content">
          <Card className="form-container" bordered={false}>
            <Title level={2} className="card-title">ชีทใหม่</Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item name="subject" label="วิชา" rules={[{ required: true, message: 'กรุณาเลือกวิชา' }]}>
                <Select placeholder="เลือกวิชา">
                  <Option value="math">คณิตศาสตร์</Option>
                  <Option value="science">วิทยาศาสตร์</Option>
                  {/* รายการวิชาอื่นๆ */}
                </Select>
              </Form.Item>
              <Form.Item name="term" label="เทอม" rules={[{ required: true, message: 'กรุณาเลือกเทอม' }]}>
                <Select placeholder="เลือกเทอม">
                  <Option value="1">เทอม 1</Option>
                  <Option value="2">เทอม 2</Option>
                </Select>
              </Form.Item>
              <Form.Item name="year" label="พ.ศ." rules={[{ required: true, message: 'กรุณาเลือกปีการศึกษา' }]}>
                <DatePicker picker="year" />
              </Form.Item>
              <Form.Item name="description" label="รายละเอียด" rules={[{ required: true, message: 'กรุณาเพิ่มรายละเอียด' }]}>
                <TextArea rows={4} placeholder="เพิ่มรายละเอียด" />
              </Form.Item>
              <Form.Item name="price" label="ราคา" rules={[{ required: true, message: 'กรุณาเพิ่มราคา' }]}>
                <Input placeholder="เพิ่มราคา" type="number" />
              </Form.Item>
              <Form.Item name="file" label="ไฟล์ชีท" valuePropName="fileList" getValueFromEvent={e => {
                  return e && e.fileList.length > 1 ? [e.fileList[1]] : e && e.fileList;
              }}>
                <Upload.Dragger name="files" action="/upload" beforeUpload={beforeUpload} onRemove={onRemove} accept=".pdf" maxCount={1}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">คลิกหรือลากไฟล์เข้ามาที่นี่เพื่ออัพโหลด</p>
                </Upload.Dragger>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  เพิ่มชีท
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AddSheet;
    