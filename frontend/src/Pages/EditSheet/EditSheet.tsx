import React, { useState, useEffect } from 'react';
import { Button, Typography, Card, Layout, Form, Input, Select, DatePicker, message, Upload, Modal } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { useNavigate, useParams } from 'react-router-dom';
import { GetSheetByID, ListCourses, UpdateSheet, DeleteSheet } from '../../services/https';
import { InboxOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Sidebar from '../Component/Sidebar/Sidebar';
import Header from '../Component/Header/Header';
import { Course } from '../../Interface/Course';
import moment from 'moment';
import './EditSheet.css';

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;
const { confirm } = Modal;

const EditSheet: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    const [sheetData, setSheetData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [originalFileList, setOriginalFileList] = useState<UploadFile[]>([]);
    const [uploadedFile] = useState<File | null>(null);

    useEffect(() => {
        if (!id) {
            message.error("ไม่พบ ID ของชีท");
            navigate("/MainSealSheet");
            return;
        }

        const fetchSheetData = async () => {
            try {
                const { data } = await GetSheetByID(id);
                setSheetData(data);
                form.setFieldsValue({
                    Title: data.Title,
                    Description: data.Description,
                    Price: data.Price,
                    Year: moment(data.Year, 'YYYY'),
                    Term: data.Term,
                    CourseID: data.CourseID
                });

                const file = {
                    uid: '-1',
                    name: data.FilePath.split('/').pop(),
                    status: 'done',
                    url: `http://localhost:8080/uploads/${data.FilePath.split('/').pop()}`
                } as UploadFile;

                setFileList([file]);
                setOriginalFileList([file]); // เก็บไฟล์เดิมสำหรับการรีเซ็ต
            } catch (error) {
                message.error("ไม่สามารถดึงข้อมูลชีทได้");
                console.error("Fetch error:", error);
            }
        };

        fetchSheetData();
    }, [id, form, navigate]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await ListCourses();
                setCourses(data);
            } catch (error) {
                console.error("Error fetching courses:", error);
                message.error("ไม่สามารถโหลดรายวิชาได้");
            }
        };

        fetchCourses();
    }, []);


    const onFinish = async (values: any) => {
        try {
            if (!id) {
                message.error("ไม่พบ ID ของชีท");
                navigate("/MainSealSheet");
                return;
            }

            if (!uploadedFile && fileList.length === 0) {
                message.error("กรุณาอัพโหลดไฟล์ PDF");
                return;
            }

            setIsLoading(true);

            const formData = new FormData();
            if (uploadedFile) {
                formData.append("file", uploadedFile); // ไฟล์ใหม่ที่อัปโหลด
            } else if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append("file", fileList[0].originFileObj); // ไฟล์เดิมใน FileList
            } else {
                formData.append("file", fileList[0]?.name || ""); // ใช้ชื่อไฟล์เดิม
            }

            formData.append("Title", values.Title);
            formData.append("Description", values.Description);
            formData.append("Price", values.Price.toString());
            formData.append("CourseID", values.CourseID.toString());
            formData.append("Year", values.Year.format("YYYY"));
            formData.append("Term", values.Term);

            console.log("FormData Preview:");
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            try {
                const response = await UpdateSheet(id, formData);
                console.log("Response from API:", response);

                if (response?.status === 200 || response?.status === 201) {
                    message.success("อัพเดทข้อมูลชีทสำเร็จ");
                    navigate("/MainSealSheet");
                } else {
                    message.error("การอัพเดทข้อมูลล้มเหลว");
                    console.error("Unexpected response:", response);
                }
            } catch (error) {
                message.error("เกิดข้อผิดพลาดขณะอัพเดทข้อมูล");
                console.error("Update error:", error);
            }
        } catch (errorInfo) {
            console.error("Validation Failed:", errorInfo);
            message.error("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง");
        } finally {
            setIsLoading(false); // ปิดสถานะโหลดไม่ว่าจะสำเร็จหรือไม่
        }
    };

    const handleFileChange = (info: UploadChangeParam<UploadFile>) => {
        const latestFile = info.fileList[info.fileList.length - 1];
        if (latestFile) {
            setFileList([latestFile]); // แทนที่ไฟล์เดิมด้วยไฟล์ใหม่
            message.success("ไฟล์ใหม่ถูกเพิ่มแล้ว");
        }
    };

    const handleResetFile = () => {
        setFileList(originalFileList); // คืนค่าไฟล์กลับเป็นไฟล์เดิม
        message.info("กลับไปใช้ไฟล์เดิมเรียบร้อยแล้ว");
    };

    const handleDeleteSheet = async () => {
        if (!id) {
            message.error("ไม่พบ ID ของชีท");
            return;
        }

        confirm({
            title: "คุณต้องการลบชีทนี้หรือไม่?",
            icon: <ExclamationCircleOutlined />,
            content: "การลบชีทจะไม่สามารถกู้คืนได้",
            okText: "ยืนยัน",
            cancelText: "ยกเลิก",
            onOk: async () => {
                try {
                    const response = await DeleteSheet(id);
                    if (response?.status === 200) {
                        message.success("ลบชีทสำเร็จ");
                        navigate("/MainSealSheet");
                    } else {
                        message.error("ไม่สามารถลบชีทได้");
                    }
                } catch (error) {
                    message.error("เกิดข้อผิดพลาดขณะลบชีท");
                    console.error("Delete error:", error);
                }
            },
        });
    };

    return (
        <Layout className="editsheet">
            <Sidebar isVisible={false} onClose={() => {}} />
            <Layout>
                <Header />
                <Content className="editsheet-content">
                    <Card className="editform-container" bordered={false}>
                        <Title level={2} className="editcard-title">แก้ไขชีท</Title>
                        {sheetData ? (
                            <Form form={form} layout="vertical" onFinish={onFinish}>
                                <Form.Item name="Title" label="ชื่อชีท" rules={[{ required: true }]} >
                                    <Input disabled={isLoading} />
                                </Form.Item>
                                <Form.Item name="CourseID" label="รายวิชา" rules={[{ required: true }]} >
                                    <Select placeholder="เลือกรายวิชา" disabled={isLoading}>
                                        {courses.map(course => (
                                            <Option key={course.ID} value={course.ID}>{course.CourseName}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="Year" label="ปีการศึกษา" rules={[{ required: true }]} >
                                    <DatePicker picker="year" disabled={isLoading} />
                                </Form.Item>
                                <Form.Item name="Term" label="เทอม" rules={[{ required: true }]} >
                                    <Select placeholder="เลือกเทอม" disabled={isLoading}>
                                        <Option value="1">เทอม 1</Option>
                                        <Option value="2">เทอม 2</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item name="Description" label="คำอธิบาย" rules={[{ required: true }]} >
                                    <TextArea rows={4} disabled={isLoading} />
                                </Form.Item>
                                <Form.Item name="Price" label="ราคา" rules={[{ required: true }]} >
                                    <Input type="number" disabled={isLoading} />
                                </Form.Item>
                                <Form.Item name="file" label="อัพโหลด PDF">
                                <Upload.Dragger
                                    name="file"
                                    beforeUpload={() => false}
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    fileList={fileList}
                                >
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">คลิกหรือลากไฟล์เพื่ออัพโหลด</p>
                                    <p className="ant-upload-hint">รองรับเฉพาะไฟล์ PDF</p>
                                </Upload.Dragger>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                    <Button
                                        type="default"
                                        danger
                                        icon={<InboxOutlined />}
                                        onClick={handleResetFile}
                                        disabled={fileList === originalFileList}
                                    >
                                        กลับไปใช้ไฟล์เดิม
                                    </Button>
                                </div>
                            </Form.Item>
                                <div className="editform-buttons">
                                    <Button type="default" danger onClick={handleDeleteSheet} disabled={isLoading}>
                                        ลบชีท
                                    </Button>
                                    <Button type="primary" htmlType="submit" loading={isLoading}>
                                        อัพเดทข้อมูลชีท
                                    </Button>
                                </div>
                            </Form>
                        ) : (
                            <p>กำลังโหลดข้อมูลชีท...</p>
                        )}
                    </Card>
                </Content>
            </Layout>
        </Layout>
    );
};

export default EditSheet;
