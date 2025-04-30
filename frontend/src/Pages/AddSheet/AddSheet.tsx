import React, { useState, useEffect } from "react";

import { Button, Form, Input, Select, DatePicker, message, Upload} from "antd";

import { InboxOutlined } from "@ant-design/icons";
import { ListCourses, CreateSheet, GetTerm } from "../../services/https";
import { CourseInterface } from "../../Interface/ICourse";
import "./AddSheet.css";

const { Option } = Select;
const { TextArea } = Input;

interface AddSheetProps {
  onClose: () => void; // Function to close the modal
}

const AddSheet: React.FC<AddSheetProps> = ({ onClose }) => {
  const [form] = Form.useForm();
  const [courses, setCourses] = useState<CourseInterface[]>([]);
  const [terms, setTerms] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true); // เพิ่ม state สำหรับการโหลดข้อมูล

  useEffect(() => {
    const fetchCoursesAndTerms = async () => {
      try {
        setIsLoading(true); // เริ่มโหลดข้อมูล
        const courseData = await ListCourses();
        setCourses(courseData);

        const termResponse = await GetTerm();
        if (Array.isArray(termResponse?.data)) {
          setTerms(termResponse.data);
        } else {
          message.error("รูปแบบข้อมูลเทอมไม่ถูกต้อง");
        }
      } catch (error) {
        message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false); // หยุดโหลดข้อมูล
      }
    };

    fetchCoursesAndTerms();
  }, []);

  const handleFileUpload = (file: File) => {
    if (!file) {
      message.error("กรุณาเลือกไฟล์ก่อนอัปโหลด");
      return;
    }
    setUploadedFile(file);
  };

  const onFinish = async (values: any) => {
    const sellerID = localStorage.getItem("sellerId");
    if (!sellerID) {
      message.error("ไม่พบ SellerID ใน localStorage");
      return;
    }
  
    if (!uploadedFile) {
      message.error("กรุณาอัพโหลดไฟล์ PDF");
      return;
    }
  
    setIsSaving(true); // เริ่มสถานะกำลังบันทึก
  
    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("Title", values.title);
      formData.append("Description", values.description);
      formData.append("Price", values.price.toString());
      formData.append("CourseID", values.courseID.toString());
      formData.append("Year", values.year.year().toString());
      formData.append("TermID", values.term);
      formData.append("SellerID", sellerID);
  
      const response = await CreateSheet(formData);
      if (response.status === 200 || response.status === 201) {
        message.success("เพิ่มชีทสำเร็จ");
        form.resetFields(); // รีเซ็ตฟอร์ม
        setUploadedFile(null); // รีเซ็ตไฟล์ที่อัปโหลด
        onClose(); // ปิด Modal
      } else {
        message.error("การเพิ่มชีทล้มเหลว");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดขณะเพิ่มข้อมูล");
      console.error("Error:", error);
    } finally {
      setIsSaving(false); // จบสถานะกำลังบันทึก
    }
  };
  

  if (isLoading) {
    return (
      <div className="fullscreen-loading">
        <h2>กำลังโหลดข้อมูล...</h2>
        <div className="loader-circle"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="add-sheet-modal-title">เพิ่มชีทใหม่</div>
      <Form form={form} layout="vertical" className="addsheet-container" onFinish={onFinish}>
        {/* ส่วนฟอร์ม */}
        <Form.Item
          name="title"
          label="ชื่อชีท"
          className="addsheet-form-item"
          rules={[{ required: true, message: "กรุณากรอกชื่อชีท" }]}
        >
          <Input className="addsheet-input" disabled={isSaving} />
        </Form.Item>
        <Form.Item
          name="courseID"
          label="รายวิชา"
          className="addsheet-form-item"
          rules={[{ required: true, message: "กรุณาเลือกรายวิชา" }]}
        >
          <Select className="addsheet-form-item" placeholder="เลือกรายวิชา" disabled={isSaving}>
            {courses.map((course) => (
              <Option key={course.ID} value={course.ID}>
                {course.CourseName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="year"
          label="ปีการศึกษา"
          className="addsheet-form-item"
          rules={[{ required: true, message: "กรุณาเลือกปีการศึกษา" }]}
        >
          <DatePicker className="addsheet-datepicker" picker="year" disabled={isSaving} />
        </Form.Item>
        <Form.Item
          name="term"
          label="เทอม"
          className="addsheet-form-item"
          rules={[{ required: true, message: "กรุณาเลือกเทอม" }]}
        >
          <Select className="addsheet-select" placeholder="เลือกเทอม" disabled={isSaving}>
            {terms.map((term) => (
              <Option key={term.ID} value={term.ID}>
                {term.Name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          label="คำอธิบาย"
          className="addsheet-form-item"
          rules={[{ required: true, message: "กรุณากรอกคำอธิบาย" }]}
        >
          <TextArea className="addsheet-textarea" rows={4} disabled={isSaving} />
        </Form.Item>
        <Form.Item
  name="price"
  label="ราคา"
  className="addsheet-form-item"
  rules={[
    { 
      required: true, 
      message: "กรุณากรอกราคา" 
    },
    {
      validator: (_, value) => {
        if (value <= 0) {
          return Promise.reject("ราคาต้องไม่น้อยกว่า 1 บาท");
        }
        return Promise.resolve();
      },
    },
  ]}
>
  <Input className="addsheet-input" type="number" disabled={isSaving} />
</Form.Item>

        <Form.Item
          name="file"
          label="อัพโหลด PDF"
          className="addsheet-form-item"
          rules={[{ required: true, message: "กรุณาอัพโหลดไฟล์" }]}
        >
          <Upload.Dragger
            className="addsheet-upload-dragger"
            name="file"
            beforeUpload={() => false}
            accept=".pdf"
            maxCount={1}
            onChange={(info) => {
              const file = info.fileList[0]?.originFileObj;
              if (file) {
                handleFileUpload(file);
              } else {
                message.error("ไม่พบไฟล์ที่ต้องการอัปโหลด");
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
        <Form.Item className="addsheet-form-item">
        <div className="addsheet-button-container">
            <Button 
            className="addsheet-Button" 
            htmlType="submit" 
            loading={isSaving} // ใช้สถานะ isSaving ในการแสดง Spin
            >
            {isSaving ? "กำลังบันทึก..." : "เพิ่มข้อมูลชีท"} {/* แสดงข้อความเมื่อกำลังบันทึก */}
            </Button>
        </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddSheet;