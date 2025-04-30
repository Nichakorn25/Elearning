import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';
import Sidebar from '../../Component/Sidebar/Sidebar';
import Header from '../../Component/Header/Header';
import { GetUserById, UpdateUserByid, GetDepartments, GetMajors } from '../../../services/https';
import { message, Upload, Button, Input, Select } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [departmentId, setDepartmentId] = useState(0);
  const [majorId, setMajorId] = useState(0);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<{ ID: number; DepartmentName: string }[]>([]);
  const [majors, setMajors] = useState<{ ID: number; MajorName: string }[]>([]);
  const [isMajorsLoading, setMajorsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const userIdFromLocalStorage = localStorage.getItem('id');
  const closeSidebar = () => {
    setSidebarVisible(false); // Function to close the sidebar
  };

  useEffect(() => {
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
            const departmentsResponse = await GetDepartments();
            if (departmentsResponse.status === 200) {
              setDepartments(departmentsResponse.data);
            }
            const filePath = data.ProfilePicture[0].FilePath.replace(/\\/g, '/');
            // Set the initial profile picture preview
            if (data.ProfilePicture && data.ProfilePicture[0]) {
              setPreview(`http://api.se-elearning.online${filePath}`);
            }
          }
        }


      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userIdFromLocalStorage]);

  useEffect(() => {
    if (departmentId !== 0) {
      fetchMajors(departmentId);
    }
  }, [departmentId]);

  const handleDepartmentChange = async (deptId: number) => {
    setDepartmentId(deptId);
    setMajorId(0);
    await fetchMajors(deptId);
  };

  const fetchMajors = async (departmentId: number) => {
    try {
      setMajorsLoading(true);
      const majorsResponse = await GetMajors(departmentId.toString());
      if (majorsResponse.status === 200) {
        setMajors(majorsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching majors', error);
    } finally {
      setMajorsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('Username', username);
    formData.append('FirstName', firstName);
    formData.append('LastName', lastName);
    formData.append('Email', email);
    formData.append('Phone', phone);
    formData.append('DepartmentID', departmentId.toString());
    formData.append('MajorID', majorId.toString());
    formData.append('Status', 'Active');

    // Check if profilePicture is set before appending to formData
    if (profilePicture) {
      console.log("Profile Picture before appending to FormData:", profilePicture);
      formData.append('ProfilePicture', profilePicture);
    }
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      if (userIdFromLocalStorage) {
        const response = await UpdateUserByid(userIdFromLocalStorage, formData);
        if (response.status === 200) {
          localStorage.setItem(
            'user',
            JSON.stringify({
              username: username,
              FirstName: firstName,
              LastName: lastName,
            })
          );
          message.success('Profile updated successfully!');
          setTimeout(() => {
            navigate('/profile');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error updating user data', error);
      message.error('Failed to update profile.');
    }
  };

  const handleRemoveImage = () => {
    setProfilePicture(null);
    setPreview(null); // Clear the preview if image is removed
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-dashboard">
      <Header />
      <Sidebar isVisible={isSidebarVisible} onClose={closeSidebar} />

      <main className="profile-content">
        <div className="profile-card">
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Input id="username" value={username} readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <Select
                id="department"
                value={departmentId !== 0 ? departmentId : undefined}
                onChange={handleDepartmentChange}
                placeholder="Select Department"
              >
                {departments.map((dept) => (
                  <Option key={dept.ID} value={dept.ID}>
                    {dept.DepartmentName}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="form-group">
              <label htmlFor="major">Major</label>
              <Select
                id="major"
                value={majorId !== 0 ? majorId : undefined}
                onChange={(value) => setMajorId(value)}
                placeholder="Select Major"
                loading={isMajorsLoading}
                disabled={!departmentId}
              >
                {majors.map((major) => (
                  <Option key={major.ID} value={major.ID}>
                    {major.MajorName}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <Input id="role" value={role} readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="profilePicture">Profile Picture</label>
              <Upload id="file"
                beforeUpload={(file) => {
                  console.log(file);
                  setProfilePicture(file); // Set the selected file
                  setPreview(URL.createObjectURL(file)); // Preview the selected file
                  return false; // Prevent automatic upload
                }}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>

              {/* Show preview of the selected image */}
              {preview && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={preview}
                    alt="Profile Preview"
                    style={{ width: '100px', borderRadius: '8px' }}
                  />
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={handleRemoveImage}
                    style={{ marginTop: '10px', color: 'red' }}
                  >
                    Remove Image
                  </Button>
                </div>
              )}
            </div>

            <div className="form-actions">
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;