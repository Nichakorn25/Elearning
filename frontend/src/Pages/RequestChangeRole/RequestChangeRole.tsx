import React, { useState } from "react";
import { message, Upload, Button, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Sidebar from "../Component/Sidebar/Sidebar";
import Header from "../Component/Header/Header";
import "./RequestChangeRole.css";
import { CreateRoleChangeRequests } from '../../services/https';
import { ChangeRoleInterface } from '../../Interface/Admin';

const RequestChangeRole: React.FC = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    phone: "",
    department: "",
    major: "",
    reason: "",
    idCard: null as File | null, // สำหรับจัดเก็บไฟล์รูปบัตร
  });
  const [fileList, setFileList] = useState<any[]>([]); // เก็บรายการไฟล์ที่อัปโหลด

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (file: File) => {
    setFormData({
      ...formData,
      idCard: file,
    });
    setFileList([{ url: URL.createObjectURL(file), name: file.name }]); // สร้าง URL สำหรับแสดง preview
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ตรวจสอบว่ามีไฟล์อัปโหลดหรือไม่
    if (!formData.idCard) {
      message.error("Please upload your ID card.");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("username", formData.username);
    formPayload.append("fullname", formData.fullname);
    formPayload.append("email", formData.email);
    formPayload.append("phone", formData.phone);
    formPayload.append("department", formData.department);
    formPayload.append("major", formData.major);
    formPayload.append("reason", formData.reason);
    formPayload.append("idCard", formData.idCard);
    
    try {
      const response = await CreateRoleChangeRequests(formPayload);
      if (response && response.status === 201) {
        message.success("Your request has been submitted successfully.");
        setFormData({
          username: "",
          fullname: "",
          email: "",
          phone: "",
          department: "",
          major: "",
          reason: "",
          idCard: null,
        });
        setFileList([]); // ล้างไฟล์ list หลังจาก submit
      } else {
        message.error("Failed to submit the request. Please try again.");
      }
    } catch (error) {
      message.error("An error occurred while submitting the request.");
    }
  };

  return (
    <div>
      <Header />
      <Sidebar isVisible={isSidebarVisible} onClose={closeSidebar} />

      <div className="request-change-role-container">
        <div className="form-card">
          <h1 className="form-title">Request for Change Role</h1>
          <p className="form-description">
            Please fill in the form below to request a role change. All fields are required.
          </p>
          <form onSubmit={handleSubmit} className="form-content">
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="fullname">Fullname:</label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="department">Department:</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Enter your department"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="major">Major:</label>
              <input
                type="text"
                id="major"
                name="major"
                value={formData.major}
                onChange={handleInputChange}
                placeholder="Enter your major"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reason">Reason for Change:</label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                rows={4}
                placeholder="Please specify why you want to change your role..."
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="idCard">Upload ID Card:</label>
              <Upload
                beforeUpload={(file) => {
                  handleFileChange(file);
                  return false; // ป้องกันไม่ให้อัปโหลดอัตโนมัติ
                }}
                accept="image/*"
                fileList={fileList}
              >
                <Button icon={<UploadOutlined />}>Upload ID Card</Button>
              </Upload>
              {fileList.length > 0 && (
                <div className="preview-container">
                  <Image
                    width={100}
                    src={fileList[0].url}
                    alt="ID Card Preview"
                  />
                </div>
              )}
            </div>
            <button type="submit" className="submit-button">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestChangeRole;
