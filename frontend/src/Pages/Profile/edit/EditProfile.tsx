import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';
import Sidebar from '../../Component/Sidebar/Sidebar';
import Header from '../../Component/Header/Header';
import { GetUserById, UpdateUserByid, GetDepartments, GetMajors } from '../../../services/https'; // Import API functions
import { UserInterface } from '../../../Interface/IUser'; // Import UserInterface
import { message } from 'antd'; // Import Ant Design message component

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  // User profile states
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [departmentId, setDepartmentId] = useState(0);
  const [majorId, setMajorId] = useState(0);
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<{ ID: number; DepartmentName: string }[]>([]);
  const [majors, setMajors] = useState<{ ID: number; MajorName: string }[]>([]);
  const [isMajorsLoading, setMajorsLoading] = useState(false);
  const userIdFromLocalStorage = localStorage.getItem('id'); // Get userId from localStorage or auth context

  useEffect(() => {
    // Fetch user and dropdown data
    const fetchData = async () => {
      try {
        if (userIdFromLocalStorage) {
          const userResponse = await GetUserById(userIdFromLocalStorage);
          if (userResponse.status === 200) {
            const data = userResponse.data;
            setUsername(data.Username || '');
            setFirstName(data.FirstName || '');
            setLastName(data.LastName || '');
            setEmail(data.Email || '');
            setPhone(data.Phone || '');
            setDepartmentId(data.DepartmentID || 0);
            setMajorId(data.MajorID || 0);
            setRole(data.Role?.RoleName || '');
            setUserId(data.ID?.toString() || '');
          }
        }

        // Fetch departments
        const departmentsResponse = await GetDepartments();
        if (departmentsResponse.status === 200) {
          setDepartments(departmentsResponse.data); // Assuming departmentsResponse.data is an array of departments
        }
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userIdFromLocalStorage]);

  const handleDepartmentChange = async (deptId: number) => {
    setDepartmentId(deptId);
    // Fetch majors based on the selected department
    await fetchMajors(deptId);
  };

  const fetchMajors = async (departmentId: number) => {
    try {
      setMajorsLoading(true);
      const majorsResponse = await GetMajors(departmentId.toString());
      if (majorsResponse.status === 200) {
        setMajors(majorsResponse.data); // Assuming majorsResponse.data is an array of majors
      }
    } catch (error) {
      console.error('Error fetching majors', error);
    } finally {
      setMajorsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData: UserInterface = {
      Username: username,
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      Phone: phone,
      DepartmentID: departmentId,
      MajorID: majorId,
      RoleID: parseInt(role), // Assuming RoleID is fixed or derived dynamically
    };

    if (userIdFromLocalStorage) {
      UpdateUserByid(userIdFromLocalStorage, updatedData)
        .then((response) => {
          if (response.status === 200) {
            console.log('Profile updated successfully');

            // Update localStorage with the new user data
            localStorage.setItem(
              'user',
              JSON.stringify({
                username: username,
                FirstName: firstName,
                LastName: lastName,
              })
            );

            // Show success message using Ant Design message
            message.success('Profile updated successfully!');

            // Navigate back to the profile page after a short delay
            setTimeout(() => {
              navigate('/profile');
            }, 2000); // Delay navigation to allow message visibility
          }
        })
        .catch((error) => {
          console.error('Error updating user data', error);
          message.error('Failed to update profile.');
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-dashboard">
      <Header />
      <Sidebar isVisible={isSidebarVisible} />

      <main className="profile-content">
        <div className="profile-card">
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" value={username} readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                value={departmentId}
                onChange={(e) => handleDepartmentChange(Number(e.target.value))}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.ID} value={dept.ID}>
                    {dept.DepartmentName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="major">Major</label>
              <select
                id="major"
                value={majorId}
                onChange={(e) => setMajorId(Number(e.target.value))}
                disabled={!departmentId || isMajorsLoading}
              >
                <option value="">Select Major</option>
                {majors.map((major) => (
                  <option key={major.ID} value={major.ID}>
                    {major.MajorName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <input type="text" id="role" value={role} readOnly />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
