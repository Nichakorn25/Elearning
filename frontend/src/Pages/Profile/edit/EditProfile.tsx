import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';
import Sidebar from '../../Component/Sidebar/Sidebar';
import Header from '../../Component/Header/Header';
import { GetUserById, UpdateUserByid } from '../../../services/https'; // Import API functions
import { UserInterface } from '../../../Interface/IUser'; // Import UserInterface

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
  const [departmentname, setDepartmentname] = useState('');
  const [majorname, setMajorname] = useState('');
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const userIdFromLocalStorage = localStorage.getItem('userId'); // Get userId from localStorage or auth context

  useEffect(() => {
    console.log('Fetching data...');
    if (userIdFromLocalStorage) {
      // Fetch the user data from API
      GetUserById(userIdFromLocalStorage)
        .then((response) => {
            console.log('User data:', response.data); // Log the response data
          if (response.status === 200) {
            console.log('User data:', response.data); 
            const data = response.data;
            setUsername(data.Username || '');
            setFirstName(data.FirstName || '');
            setLastName(data.LastName || '');
            setEmail(data.Email || '');
            setPhone(data.Phone || '');
            setDepartmentname(data.departmentname || '');
            setMajorname(data.majorname || '');
            setRole(data.rolename || '');
            setUserId(data.ID?.toString() || '');
          }
        })
        .catch((error) => {
          console.error('Error fetching user data', error);
        })
        .finally(() => setLoading(false)); // Stop loading once data is fetched
    }
  }, [userIdFromLocalStorage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create the user data object for updating
    const updatedData: UserInterface = {
        Username: username,
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Phone: phone,
        DepartmentID: 1, // Assuming you have logic to fetch DepartmentID
        departmentname, // Can be updated dynamically
        MajorID: 1, // Assuming you have logic to fetch MajorID
        majorname, // Can be updated dynamically
        RoleID: 1, // Assuming you have logic to fetch RoleID
        rolename: role, // Can be updated dynamically
    };

    // Call the UpdateUserByid API function to update the user's profile
    if (userIdFromLocalStorage) {
      UpdateUserByid(userIdFromLocalStorage, updatedData)
        .then((response) => {
          if (response.status === 200) {
            console.log('Profile updated successfully');
            navigate('/profile'); // Navigate back to profile page after update
          }
        })
        .catch((error) => {
          console.error('Error updating user data', error);
        });
    }
  };

  // If loading, show a loading state
  if (loading) {
    return <div>Loading...</div>; // Check if this part renders.
  }
  

  return (
    <div className="profile-dashboard">
      {/* Header Section */}
      <Header />

      {/* Sidebar Section */}
      <Sidebar isVisible={isSidebarVisible} />

      {/* Profile Content */}
      <main className="profile-content">
        <div className="profile-card">
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
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
              <label htmlFor="departmentname">Department</label>
              <input
                type="text"
                id="departmentname"
                value={departmentname}
                onChange={(e) => setDepartmentname(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="majorname">Major</label>
              <input
                type="text"
                id="majorname"
                value={majorname}
                onChange={(e) => setMajorname(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <input
                type="text"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
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
