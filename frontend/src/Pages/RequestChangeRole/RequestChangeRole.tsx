import React, { useState } from "react";
import Sidebar from "../Component/Sidebar/Sidebar";
import Header from "../Component/Header/Header";
import "./RequestChangeRole.css";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        idCard: e.target.files[0], // เก็บไฟล์ที่ผู้ใช้อัปโหลด
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Request Submitted:", formData);
    if (formData.idCard) {
      console.log("Uploaded File:", formData.idCard.name);
    }
    // ส่งข้อมูลไปยัง backend หรือ API
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
              <input
                type="file"
                id="idCard"
                name="idCard"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
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
