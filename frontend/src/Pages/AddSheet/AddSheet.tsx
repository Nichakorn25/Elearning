import React, { useState, useEffect } from 'react';
import { Button, Typography, Card, Layout, Form, Input, Select, DatePicker, message, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ListCourses, CreateSheet } from '../../services/https';
import Sidebar from '../Component/Sidebar/Sidebar';
import Header from '../Component/Header/Header';
import { InboxOutlined } from '@ant-design/icons';
import { Course } from '../../Interface/Course';
import './AddSheet.css';
const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const AddSheet: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    useEffect(() => {
        ListCourses()
            .then(data => setCourses(data))
            .catch(error => {
                message.error('ไม่สามารถโหลดรายวิชาได้');
                console.error('Error:', error);
            });
    }, []);

    const handleFileUpload = (file: File) => {
        if (!file) {
            message.error('กรุณาเลือกไฟล์ก่อนอัปโหลด');
            return;
        }
        setUploadedFile(file);
        message.success('ไฟล์ถูกเลือกแล้ว');
    };

    const onFinish = async (values: any) => {
        const sellerID = localStorage.getItem("sellerId");
        if (!sellerID) {
            message.error("ไม่พบ UserID ใน localStorage");
            return;
        }

        if (!uploadedFile) {
            message.error("กรุณาอัพโหลดไฟล์ PDF");
            return;
        }

        setIsSaving(true);

        try {
            // สร้าง FormData
            const formData = new FormData();
            formData.append("file", uploadedFile); // แนบไฟล์
            formData.append("Title", values.title);
            formData.append("Description", values.description);
            formData.append("Price", values.price.toString());
            formData.append("CourseID", values.courseID.toString());
            formData.append("Year", values.year.year().toString());
            formData.append("Term", values.term); // ส่งค่า Term
            formData.append("SellerID", sellerID);

            console.log("FormData Preview:");
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            // ส่งคำขอไปยัง API
            const response = await CreateSheet(formData);
            if (response.status === 200 || response.status === 201) {
                message.success("เพิ่มข้อมูลสำเร็จ");
                navigate("/MainSealSheet");
            } else {
                message.error("การเพิ่มข้อมูลล้มเหลว");
            }
        } catch (error) {
            message.error("เกิดข้อผิดพลาดขณะเพิ่มข้อมูล");
            console.error("Error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Layout className="sealsheet">
            <Sidebar isVisible={false} onClose={() => {}} />
            <Layout>
                <Header />
                <Content className="sealsheet-content">
                    <Card className="sealsheetform-container" bordered={false}>
                        <Title level={2} className="card-title">เพิ่มชีทใหม่</Title>
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <Form.Item name="title" label="ชื่อชีท" rules={[{ required: true }]}>
                                <Input disabled={isSaving} />
                            </Form.Item>
                            <Form.Item name="courseID" label="รายวิชา" rules={[{ required: true }]}>
                                <Select placeholder="เลือกรายวิชา" disabled={isSaving}>
                                    {courses.map(course => (
                                        <Option key={course.ID} value={course.ID}>{course.CourseName}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="year" label="ปีการศึกษา" rules={[{ required: true }]}>
                                <DatePicker picker="year" disabled={isSaving} />
                            </Form.Item>
                            <Form.Item name="term" label="เทอม" rules={[{ required: true }]}>
                                <Select placeholder="เลือกเทอม" disabled={isSaving}>
                                    <Option value="1">เทอม 1</Option>
                                    <Option value="2">เทอม 2</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="description" label="คำอธิบาย" rules={[{ required: true }]}>
                                <TextArea rows={4} disabled={isSaving} />
                            </Form.Item>
                            <Form.Item name="price" label="ราคา" rules={[{ required: true }]}>
                                <Input type="number" disabled={isSaving} />
                            </Form.Item>
                            <Form.Item
                                name="file"
                                label="อัพโหลด PDF"
                                rules={[{ required: true, message: "กรุณาอัพโหลดไฟล์" }]}
                            >
                                <Upload.Dragger
                                    name="file"
                                    beforeUpload={() => false}
                                    accept=".pdf"
                                    maxCount={1}
                                    onChange={(info) => {
                                        const file = info.fileList[0]?.originFileObj;
                                        if (file) {
                                            handleFileUpload(file);
                                        } else {
                                            message.error('ไม่พบไฟล์ที่ต้องการอัปโหลด');
                                        }
                                    }}
                                >
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">คลิกหรือลากไฟล์เพื่ออัพโหลด</p>
                                    <p className="ant-upload-hint">รองรับเฉพาะไฟล์ PDF</p>
                                </Upload.Dragger>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isSaving}>เพิ่มชีท</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AddSheet;
