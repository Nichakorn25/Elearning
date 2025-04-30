import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select, DatePicker, message, Upload, Modal } from "antd";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import { GetSheetByID, ListCourses, GetTerm, UpdateSheet, DeleteSheet } from "../../services/https";
import { ExclamationCircleOutlined, InboxOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { CourseInterface } from "../../Interface/ICourse";
import "./EditSheet.css";

const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;

interface EditSheetProps {
  sheetId: string;
  visible: boolean;
  onClose: () => void;
}

const EditSheet: React.FC<EditSheetProps> = ({ sheetId, visible, onClose }) => {
  const [form] = Form.useForm();
  const [sheetData, setSheetData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<CourseInterface[]>([]);
  const [terms, setTerms] = useState<any[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [originalFileList, setOriginalFileList] = useState<UploadFile[]>([]);
  const [uploadedFile] = useState<File | null>(null);

  useEffect(() => {
    if (visible) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const { data } = await GetSheetByID(sheetId);
          setSheetData(data);

          form.setFieldsValue({
            Title: data.Title,
            Description: data.Description,
            Price: data.Price,
            Year: dayjs(String(data.Year), "YYYY"),
            TermID: data.TermID,
            CourseID: data.CourseID,
          });

          if (data.FilePath) {
            const file = {
              uid: "-1",
              name: data.FilePath.split("/").pop(),
              status: "done",
              url: `https://api.se-elearning.online${data.FilePath.split("/").pop()}`,
            } as UploadFile;
            setFileList([file]);
            setOriginalFileList([file]); 
          }
  
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
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [sheetId, visible, form]);

  const onFinish = async (values: any) => {
    try {
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
      formData.append("TermID", values.TermID);

      const response = await UpdateSheet(sheetId, formData);
      if (response?.status === 200 || response?.status === 201) {
        message.success("อัพเดทข้อมูลชีทสำเร็จ");
        onClose();
      } else {
        message.error("การอัพเดทข้อมูลล้มเหลว");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };
  const handleFileChange = (info: UploadChangeParam<UploadFile>) => {
    const latestFile = info.fileList[info.fileList.length - 1];
    if (latestFile) {
        setFileList([latestFile]); // แทนที่ไฟล์เดิมด้วยไฟล์ใหม่
    }
};

const handleResetFile = () => {
    setFileList(originalFileList); // คืนค่าไฟล์กลับเป็นไฟล์เดิม
    message.info("กลับไปใช้ไฟล์เดิมเรียบร้อยแล้ว");
};

const handleDeleteSheet = async () => {
    if (!sheetId) {
        message.error("ไม่พบ ID ของชีท");
        return;
    }

    confirm({
      title: "คุณต้องการลบชีทนี้หรือไม่?",
      icon: <ExclamationCircleOutlined />,
      content: "การลบชีทจะไม่สามารถกู้คืนได้",
      okText: "ยืนยัน",
      cancelText: "ยกเลิก",
      okButtonProps: {
        style: {
          backgroundColor: '#1890ff', // เปลี่ยนสีพื้นหลังปุ่ม
          borderColor: '#1890ff', // เปลี่ยนสีขอบ
          fontSize: '16px', // ปรับขนาดตัวอักษร
          fontWeight: 'bold', // เพิ่มความหนาให้ตัวอักษร
          padding: '7px 16px', // ปรับขนาดปุ่ม
          borderRadius: '4px', // เพิ่มความมนให้ขอบปุ่ม
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // เพิ่มเงาให้ปุ่ม
        },
      },
      cancelButtonProps: {
        style: {
          fontSize: '16px',
          color: '#ff4d4f', // สีแดงสำหรับปุ่มยกเลิก
          padding: '8px 16px',
          borderRadius: '4px',
          borderColor: '#ff4d4f',
        },
      },
      onOk: async () => {
        try {
          const response = await DeleteSheet(sheetId);
          if (response?.status === 200) {
            message.success("ลบชีทสำเร็จ");
            onClose();
          } else {
            message.error("ไม่สามารถลบชีทได้");
          }
        } catch (error) {
          message.error("เกิดข้อผิดพลาดขณะลบชีท");
          console.error("Delete error:", error);
        }
      },
      onCancel() {
        console.log("การยกเลิกการลบชีท");
      },
    });
};

  return (
    <Modal
     className="edit-sheet-modal"
      title="แก้ไขชีท"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      {isLoading ? (
        <div className="fullscreen-loading">
          <div className="loader-circle"></div>
          <h2>กำลังโหลด...</h2>
        </div>
      ) : (
        sheetData && (
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="Title" label="ชื่อชีท" rules={[{ required: true }]}>
              <Input disabled={isLoading} />
            </Form.Item>
            <Form.Item name="CourseID" label="รายวิชา" rules={[{ required: true }]}>
              <Select placeholder="เลือกรายวิชา" disabled={isLoading}>
                {courses.map((course) => (
                  <Option key={course.ID} value={course.ID}>
                    {course.CourseName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="Year"
              label="ปีการศึกษา"
              rules={[{ required: true, message: "กรุณาเลือกปีการศึกษา" }]}
            >
              <DatePicker
                picker="year"
                disabled={isLoading}
                format="YYYY"
                value={sheetData?.Year ? dayjs(sheetData.Year, "YYYY") : null}
              />
            </Form.Item>
            <Form.Item name="TermID" label="เทอม" rules={[{ required: true }]}>
              <Select placeholder="เลือกเทอม" disabled={isLoading}>
                {terms.map((term) => (
                  <Option key={term.ID} value={term.ID}>
                    {term.Name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="Description" label="คำอธิบาย" rules={[{ required: true }]}>
              <TextArea rows={4} disabled={isLoading} />
            </Form.Item>
            <Form.Item
            name="Price"
            label="ราคา"
            rules={[
              { required: true, message: "กรุณากรอกราคา" },
              {
                validator: (_, value) => {
                  if (value <= 0) {
                    return Promise.reject("ราคาต้องมากกว่า 0 บาท");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input type="number" disabled={isLoading} />
          </Form.Item>

            <Form.Item>
            <div className="upload-header">
                <label className="upload-label">อัพโหลด PDF</label>
                <Button
                className="reset-file-button"
                onClick={handleResetFile}
                disabled={isLoading}
                >
                กลับไปใช้ไฟล์เดิม
                </Button>
            </div>
            </Form.Item>

        <Form.Item name="file">
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
        </Form.Item>  
          <Form.Item>
  <div className="editsheet-button-container">
    {/* ปุ่มอัพเดทข้อมูลชีท */}
    <Button
      className="editsheet-Button"
      htmlType="submit"
      loading={isLoading}
      disabled={isLoading}
    >
      อัพเดทข้อมูลชีท
    </Button>
    {/* ปุ่มลบชีท */}
    <Button
      className="delete-sheet-button"
      danger
      onClick={handleDeleteSheet}
      disabled={isLoading}
    >
      ลบชีท
    </Button>
  </div>
</Form.Item>

          </Form>
        )
      )}
    </Modal>
  );
};

export default EditSheet;