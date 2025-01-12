  import React, { useState, useEffect } from "react";
  import { message, Upload, Button, Image, Form, Input, Spin } from "antd";
  import { UploadOutlined } from "@ant-design/icons";
  import Sidebar from "../Component/Sidebar/Sidebar";
  import Header from "../Component/Header/Header";
  import "./RequestChangeRole.css";
  import { CreateRoleChangeRequests, GetUserById } from "../../services/https"; // Import API services
  import { ChangeRoleInterface } from "../../Interface/Admin";
  import { useNavigate } from "react-router-dom";

  const RequestChangeRole: React.FC = () => {
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [formData, setFormData] = useState<ChangeRoleInterface>({
      username: "",
      fullname: "",
      email: "",
      phone: "",
      department: "",
      major: "",
      reason: "",
      idCard: null,
    });
    const [fileList, setFileList] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    // ดึง userId จาก localStorage
    const userId = localStorage.getItem("id");

    // Fetch user data when component loads
    useEffect(() => {
      const fetchUserData = async () => {
        if (!userId) {
          message.error("User not logged in.");
          navigate("/Login"); // ถ้าไม่มี userId ให้เปลี่ยนเส้นทางไปหน้า Login
          return;
        }

        try {
          setLoading(true);
          const response = await GetUserById(userId);
          if (response.status === 200) {
            const userData = response.data;
            setFormData({
              username: userData.Username,
              fullname: `${userData.FirstName} ${userData.LastName}`,
              email: userData.Email,
              phone: userData.Phone,
              department: userData.Department?.DepartmentName || "N/A",
              major: userData.Major?.MajorName || "N/A",
              reason: "",
              idCard: null,
            });
          } else {
            message.error("Failed to load user data.");
          }
        } catch (error) {
          message.error("An error occurred while fetching user data.");
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }, [navigate, userId]);

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
      setFileList([{ url: URL.createObjectURL(file), name: file.name }]); // แสดง preview ของไฟล์ที่อัปโหลด
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.idCard) {
        message.error("Please upload your ID card.");
        return;
      }

      const formPayload = new FormData();
      // formPayload.append("username", formData.username);
      // formPayload.append("fullname", formData.fullname);
      // formPayload.append("email", formData.email);
      // formPayload.append("phone", formData.phone);
      // formPayload.append("department", formData.department);
      // formPayload.append("major", formData.major);
      formPayload.append("userID", userId);
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
          setFileList([]);
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

            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="form-content">
                <div className="form-group">
                  <label htmlFor="username">Username:</label>
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    required
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fullname">Fullname:</label>
                  <Input
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
                  <Input
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
                  <Input
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
                  <Input
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
                  <Input
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
                  <Input.TextArea
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
                      return false;
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
            )}
          </div>
        </div>
      </div>
    );
  };

  export default RequestChangeRole;
