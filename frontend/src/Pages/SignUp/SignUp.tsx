import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SignUp.css";
import LoginPopup from "../LoginPopup/LoginPopup";
import HeaderTabBFLogin from "../Component/HeaderTabBFLogin/HeaderTabBFLogin";

const SignUp: React.FC = () => {
  // State สำหรับจัดเก็บ departments และ majors
  const [departments, setDepartments] = useState<any[]>([]);
  const [majors, setMajors] = useState<any[]>([]);
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
  })
  
  const [isLoginPopupVisible, setLoginPopupVisible] = useState(false);

  // ฟังก์ชันแสดง Popup
  const handleOpenLoginPopup = () => {
    setLoginPopupVisible(true);
  };

  // ฟังก์ชันซ่อน Popup
  const closeLoginPopup = () => {
    setLoginPopupVisible(false);
  };;

  // Fetch Departments เมื่อโหลดหน้า
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("/api/departments");
        console.log("Departments:", response.data); // Debug API response
        setDepartments(response.data || []); // ตรวจสอบข้อมูลที่ส่งกลับ
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
          const response = await axios.get(
            `/api/majors?departmentId=${selectedDepartment}`
          );
          console.log("Majors:", response.data); // Debug API response
          setMajors(response.data || []);
        } catch (error) {
          console.error("Error fetching majors:", error);
        }
      } else {
        setMajors([]); // รีเซ็ต majors ถ้าไม่มี department ถูกเลือก
      }
    };
    fetchMajors();
  }, [selectedDepartment]);

  // ฟังก์ชันจัดการการเปลี่ยนค่าในฟอร์ม
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // ถ้าเปลี่ยน Department จะตั้ง Major ให้เป็นค่าว่าง
    if (name === "department") {
      setSelectedDepartment(value);
      setFormData({ ...formData, major: "" });
    }
  };

  // ฟังก์ชันสำหรับ Submit ฟอร์ม
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("/api/signup", formData);
      if (response.status === 201) {
        alert("Sign Up Successful!");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Failed to sign up. Please try again.");
    }
  };

  return (
    <>
    <HeaderTabBFLogin onLoginClick={handleOpenLoginPopup} />
    <div className="signup-container">
      <h1 className="signup-title">Sign Up</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Department</option>
            {Array.isArray(departments) &&
              departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
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
            {Array.isArray(majors) &&
              majors.map((major) => (
                <option key={major.id} value={major.id}>
                  {major.name}
                </option>
              ))}
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
