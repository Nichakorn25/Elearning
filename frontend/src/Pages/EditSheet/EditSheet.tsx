import React, { useState, useEffect } from "react";
import { Button, Typography, Card, Layout, Form, Input, Select, DatePicker, Upload, message } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import Sidebar from '../Component/Sidebar/Sidebar';
import Header from '../Component/Header/Header';
import './EditSheet.css';

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const EditSheet: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSheetData();
      setFileList(data.fileList); // Set the initial file list
      form.setFieldsValue({
        subject: data.subject,
        term: data.term,
        year: moment(data.year),
        description: data.description,
        price: data.price,
        file: data.fileList
      });
    };
    fetchData();
  }, [form]);

  const onFinish = (values: any) => {
    console.log('Updated values of form:', values);
    message.success('ชีทได้ถูกอัปเดตแล้ว');
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
    setFileList(prev => prev.filter(item => item.uid !== file.uid));
    return true;
  };

  const handleChange = ({ fileList }) => setFileList(fileList);

  return (
    <Layout className="editsheet">
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
      <Layout>
        <Header />
        <Content className="editsheet-content">
          <Card className="form-container" bordered={false}>
            <Title level={2} className="card-title">แก้ไขชีท</Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="subject" label="วิชา" rules={[{ required: true, message: 'กรุณาเลือกวิชา' }]}>
                <Select placeholder="เลือกวิชา">
                  <Option value="math">คณิตศาสตร์</Option>
                  <Option value="science">วิทยาศาสตร์</Option>
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
                  return e && e.fileList;
              }}>
                <Upload.Dragger name="files" action="/update" beforeUpload={beforeUpload} onRemove={onRemove} onChange={handleChange} accept=".pdf" fileList={fileList}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">คลิกหรือลากไฟล์เข้ามาที่นี่เพื่ออัพโหลด</p>
                </Upload.Dragger>
              </Form.Item>
              {/* Other Form Items */}
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  อัปเดตชีท
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default EditSheet;

function fetchSheetData() {
  // Return simulated data including a file list
  return Promise.resolve({
    subject: 'science',
    term: '2',
    year: 2024,
    description: 'Detailed description here',
    price: '450',
    fileList: [{
      uid: '-1',
      name: 'example.pdf',
      status: 'done',
      url: 'http://example.com/example.pdf'
    }]
  });
}
