import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';
import Sidebar from '../../Component/Sidebar/Sidebar';
import Header from '../../Component/Header/Header';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  // User profile states
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [faculty, setFaculty] = useState('');
  const [program, setProgram] = useState('');

  // Fetch user data from API (or session/localStorage)
  useEffect(() => {
    // Mock API call or replace with real API
    const fetchUserData = async () => {
      // Replace with actual API call
      const response = await fetch('/api/user-profile'); // Example endpoint
      const userData = await response.json();

      setName(userData.name);
      setUserId(userData.userId);
      setEmail(userData.email);
      setFaculty(userData.faculty);
      setProgram(userData.program);
    };

    fetchUserData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here, send the updated profile data to the backend API
    console.log('Profile updated', { name, userId, email, faculty, program });
  };

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
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="userId">User ID</label>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                disabled
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
              <label htmlFor="faculty">Faculty</label>
              <input
                type="text"
                id="faculty"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="program">Program</label>
              <input
                type="text"
                id="program"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">Save Changes</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
