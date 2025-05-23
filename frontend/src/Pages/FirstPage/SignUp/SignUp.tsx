import React, { useState, useEffect } from "react";
// import axios from "axios";
import "./SignUp.css";
import {message} from "antd";
import {useNavigate } from "react-router-dom";
import LoginPopup from "../LoginPopup/LoginPopup";
import HeaderTabBFLogin from "../../Component/HeaderTabBFLogin/HeaderTabBFLogin";
import { UserInterface,DepartmentInterface,MajorInterface} from "../../../Interface/IUser";
import { GetDepartments,GetMajors,CreateUser } from "../../../services/https";
import backgroundVideo from "../../../assets/loginbackground.mp4"

const SignUp: React.FC = () => {
  // State สำหรับจัดเก็บ departments และ majors
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // สถานะสำหรับหน้าโหลด
  const [departments, setDepartments] = useState<DepartmentInterface[]>([]);
  const [majors, setMajors] = useState<MajorInterface[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    major: "",
    RoleID: 1,
    status: "",
  })

  
  const [isLoginPopupVisible, setLoginPopupVisible] = useState(false);

  // ฟังก์ชันแสดง Popup
  const handleOpenLoginPopup = () => {
    setLoginPopupVisible(true);
  };

  // ฟังก์ชันซ่อน Popup
  const closeLoginPopup = () => {
    setLoginPopupVisible(false);
  };

  // Fetch Departments เมื่อโหลดหน้า
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await GetDepartments(); // เรียกใช้ฟังก์ชัน GetDepartments
        if (res.status === 200) {
          setDepartments(res.data); // เก็บข้อมูลใน state
          console.log(res.data);
        } else {
          console.error("Failed to fetch departments.");
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    
    fetchDepartments();
  }, []);

  // Fetch Majors เมื่อเลือก Department
  useEffect(() => {
    const fetchMajors = async () => {
      if (selectedDepartment) {
        try {
          console.log("Fetching majors for department:", selectedDepartment); // Debug
          const res = await GetMajors(selectedDepartment); // เรียกใช้ GetMajors
          if (res.status === 200) {
            console.log("Majors API Response:", res.data); // Debug API Response
            setMajors(res.data);
          } else {
            console.error("Failed to fetch majors.");
          }
        } catch (error) {
          console.error("Error fetching majors:", error);
        }
      } else {
        setMajors([]); // Reset majors ถ้าไม่มี department ถี่กเลือก
      }
    };
    fetchMajors();
  }, [selectedDepartment]);
  

  // ฟังก์ชันจัดการกลับการเปลี่ยนค่าในฟอร์ม
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
  
    if (name === "department") {
      // อัปเดต Department และตั้ง Major เป็นค่าว่าง
      setSelectedDepartment(value); 
      setFormData((prev) => ({
        ...prev,
        department: value,
        major: "", // Reset ค่า Major เมื่อเปลี่ยน Department
      }));
    } else {
      // อัปเดตฟิลด์อื่น ๆ
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  // ฟังก์ชันสำหรับ Submit ฟอร์ม
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }
    const values: UserInterface = {
      Username: formData.username,
      Password: formData.password,
      FirstName: formData.firstName,
      LastName: formData.lastName,
      Email: formData.email,
      DepartmentID: Number(1), // แปลงเป็น number
      MajorID: Number(1),           // แปลงเป็น number
      Phone: formData.phone,
      RoleID: formData.RoleID,
    };
  
    try {
      setLoading(true); // เริ่มหน้าโหลด
      const response = await CreateUser(values);
      if (response.status === 201) {
        message.success("Sign Up Successful!");
        setTimeout(() => {
          setLoading(false); // หยุดหน้าโหลด
          navigate("/BeforeLogin"); // นำไปยังหน้า BeforeLogin
        }, 2000); // หน่วงเวลา 2 วินาที
      }
    } catch (error) {
      console.error("Error signing up:", error);
      message.error("Failed to sign up. Please try again.");
      setLoading(false); // หยุดหน้าโหลดในกรณีเกิดข้อผิดพลาด
    }
  };
  

  return (
    <>
     {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    <HeaderTabBFLogin onLoginClick={handleOpenLoginPopup} />
    <div className="signup-container">
      {/* วิดีโอพื้นหลัง */}
      <video autoPlay loop muted className="backgroundbeforelogin-video">
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <h1 className="signup-title">Sign Up</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            className="dropdown"
            required
          >
            <option value="">Select Department</option>
            {departments.length > 0 ? (
              departments.map((department) => (
                  <option key={department.ID} value={department.ID}>
                    {department.DepartmentName}
                  </option>
                ))
            ) : (
              <>
               No data
              </>
            )}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="major">Major</label>
          <select
            id="major"
            name="major"
            value={formData.major}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Major</option>
            {majors.length > 0 ? (
              majors.map((majors) => (
                  <option key={majors.ID} value={majors.ID}>
                    {majors.MajorName}
                  </option>
                ))
            ) : (
              <>
               No data available
              </>
            )}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="signup-submit">
          Sign Up
        </button>
      </form>
      {isLoginPopupVisible && <LoginPopup onClose={closeLoginPopup} />}
    </div>
    </>
  );
};

export default SignUp;