import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import Sidebar from '../Component/Sidebar/Sidebar';
import Header from '../Component/Header/Header';
import { GetUserById } from '../../services/https';
import { UserInterface } from '../../Interface/IUser';
import simpleAvatar from "../../assets/cat.png"

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [userProfile, setUserProfile] = useState<UserInterface | null>(null);
  const [loading, setLoading] = useState(true);

  const closeSidebar = () => {
    setSidebarVisible(false); // Function to close the sidebar
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem('id');
      if (!userId) {
        navigate('/Login');
        return;
      }

      try {
        const response = await GetUserById(userId);
        if (response.status === 200) {
          setUserProfile(response.data);
          // Save profile picture to localStorage
          const profilePictureUrl = response.data.ProfilePicture?.[0]?.FilePath.replace(/\\/g, '/')
            ? `https://api.se-elearning.online${response.data.ProfilePicture[0].FilePath.replace(/\\/g, '/')}`
            : simpleAvatar;
          localStorage.setItem('profilePicture', profilePictureUrl);
        } else {
          console.error('Failed to fetch user profile:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleEditProfileClick = () => {
    navigate('/EditProfile');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Retrieve the profile picture from localStorage
  const profileImageUrl = localStorage.getItem('profilePicture') || 'https://via.placeholder.com/120';

  return (
    <div className="profile-dashboard">
      {/* Header Section */}
      <Header />

      {/* Sidebar Section */}
      <Sidebar isVisible={isSidebarVisible} onClose={closeSidebar}/>

      {/* Profile Content */}
      <main className="profile-content">
        <div className="profile-card">
          <div className="nested-boxes">
            <img
              className="profile-avatar"
              src={profileImageUrl} // Use profile picture from localStorage or fallback URL
              alt="User Avatar"
            />
            <div className="profile-details">
              <h3>
                {userProfile?.FirstName || 'N/A'} {userProfile?.LastName || 'N/A'}
              </h3>
              <p>Username: {userProfile?.Username || 'N/A'}</p>
              <p>User ID: {userProfile?.ID || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="profile-card">
          <div className="nested-boxes">
            <div className="nested-box">
              <h4>Contact Info</h4>
              <p>Email: {userProfile?.Email || 'N/A'}</p>
              <p>Phone: {userProfile?.Phone || 'N/A'}</p>
            </div>
            <div className="nested-box">
              <h4>Details</h4>
              <p>Department: {userProfile?.Department?.DepartmentName || 'N/A'}</p>
              <p>Major: {userProfile?.Major?.MajorName || 'N/A'}</p>
              <p>Role: {userProfile?.Role?.RoleName || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <button className="profile-button" onClick={handleEditProfileClick}>
            Edit Profile
          </button>
        </div>
      </main>
    </div>
  );
};

export default Profile;