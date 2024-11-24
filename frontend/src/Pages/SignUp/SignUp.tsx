import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HeaderTabBFLogin from "../Component/HeaderTabBFLogin/HeaderTabBFLogin";
import "./SignUp.css";

const SignUp: React.FC = () => {
  const [departments, setDepartments] = useState([]); // State for Departments
  const [majors, setMajors] = useState([]); // State for Majors
  const [selectedDepartment, setSelectedDepartment] = useState(""); // Track selected department
  const [formData, setFormData] = useState({
    department: "",
    major: "",
    username: "",
    email: "",
    password: "",
  });

  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [isLoadingMajors, setIsLoadingMajors] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Departments
    setIsLoadingDepartments(true);
    axios
      .get("/departments")
      .then((res) => {
        setDepartments(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch departments:", err);
      })
      .finally(() => {
        setIsLoadingDepartments(false);
      });
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      // Fetch Majors when department is selected
      setIsLoadingMajors(true);
      axios
        .get(`/majors/${selectedDepartment}`)
        .then((res) => {
          setMajors(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch majors:", err);
        })
        .finally(() => {
          setIsLoadingMajors(false);
        });
    }
  }, [selectedDepartment]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "department") {
      setSelectedDepartment(value);
      setFormData({ ...formData, major: "" }); // Reset major when department changes
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Submit the data to your API or backend service
    axios
      .post("/SignUp", formData)
      .then(() => {
        alert("Sign Up Successful!");
        navigate("/BeforeLogin"); // Redirect to login page
      })
      .catch((err) => {
        console.error("Error during signup:", err);
        alert("Sign Up Failed. Please try again.");
      });
  };

  return (
    <div className="signup-container">
      <HeaderTabBFLogin onLoginClick={() => navigate("/BeforeLogin")} />
      <h1 className="signup-title">Sign Up</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Department</option>
            {isLoadingDepartments ? (
              <option>Loading...</option>
            ) : (
              departments.map((dept: any) => (
                <option key={dept.ID} value={dept.ID}>
                  {dept.Name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="major">Major:</label>
          <select
            id="major"
            name="major"
            value={formData.major}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Major</option>
            {isLoadingMajors ? (
              <option>Loading...</option>
            ) : (
              majors.map((major: any) => (
                <option key={major.ID} value={major.ID}>
                  {major.Name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="username">Username:</label>
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
          <label htmlFor="email">Email:</label>
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
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="signup-submit">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
