import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar"; // Import Sidebar
import "./Header.css";
// import axios from "axios";
import { StudentBookingInterface } from "../../../Interface/IAppointment";
import { GetMessageById } from "../../../services/https";
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import simpleAvatar from "../../../assets/cat.png"

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  // const [unreadBookings, setUnreadBookings] = useState(0);
  const [bookings] = useState([]);
  const [isNotificationVisible, setNotificationVisible] = useState(false);

  // ดึงข้อมูลการจอง
  const userIdstr = localStorage.getItem("id"); // ดึง userId จาก localStorage
  useEffect(() => {
    if (userIdstr) {
      fetchBookings(userIdstr);
    }
  }, []);
  const [Booking, setBooking] = useState<StudentBookingInterface[]>([]);
  const fetchBookings = async (userIdstr: string ) => {
    try {
        const res = await GetMessageById(userIdstr);
        if (res.status === 200) {
          setBooking(res.data);
            console.log(res.data); 
        }
    } catch (error) {
        console.error("Error fetching meassage data:", error);
    }
};
  // const fetchBookings = async (userId: string) => {
  //   try {
  //     const response = await axios.get(`/api/student-bookings`, {
  //       params: { userID: userId },
  //     });
  //     if (response.status === 200) {
  //       setBookings(response.data.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching bookings:", error);
  //   }
  // };

  // Get user role and user data from localStorage
  const userRole = localStorage.getItem("role"); // RoleID: '1', '2', '3'
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Extract user data or set default values
  const username = user?.username || "N/A";
  const firstName = user?.FirstName || "N/A";
  const lastName = user?.LastName || "N/A";

  // Get profile picture URL from localStorage
  const profileImageUrl =
    localStorage.getItem("profilePicture") || simpleAvatar;

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  const goToDashboard = () => {
    closeDropdown();
    navigate("/dashboard");
  };

  const goToProfile = () => {
    closeDropdown();
    navigate("/profile");
  };

  const goToAdmin = () => {
    closeDropdown();
    navigate("/admin"); // Navigate to the admin page
  };

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.clear(); // Clear all stored data on logout
    closeDropdown();
    navigate("/");
  };

  const handleTitleClick = () => {
    navigate("/dashboard");
  };
  
  console.log(simpleAvatar)
  console.log("Profile Image URL:", profileImageUrl);
  return (
    <>
      <header className="stddashboard-header">
        <div className="stddashboard-header-left">
          <button className="stddashboard-menu-button" onClick={toggleSidebar}>
            ☰
          </button>
          <h1 onClick={handleTitleClick} style={{ cursor: "pointer" }}>
            SE e-Learning
          </h1>
        </div>

        <div className="stddashboard-header-right">
          {/* Notification Button */}
          
          <div
            className="notification-container"
            onClick={() => setNotificationVisible(!isNotificationVisible)}
          >
            {/* ใช้ CircleNotificationsIcon เป็นไอคอนหลัก */}
            <CircleNotificationsIcon className="notification-icon" />

            {/* แสดง badge ถ้ามีการจอง */}
            {bookings.length > 0 && (
              <span className="notification-badge">{bookings.length}</span>
            )}
          </div>

          {/* Notification Popup */}
          {isNotificationVisible && (
            <div className="notification-popup">
              <div className="notification-popup__header">
                <h3>Notifications</h3>
                <button
                  className="notification-popup__close"
                  onClick={() => setNotificationVisible(false)}
                >
                  ✕
                </button>
              </div>
              <div className="notification-popup__messages">
                {Booking.length > 0 ? (
                    Booking.map((data,index) => (
                        <>
                          <div key={index} style={{borderBottom:'1px solid #000', padding:'20px 0'}} >
                            <p style={{fontSize:'16px'}}>ผู้จอง : {data.User?.Username} {data.User?.FirstName} {data.User?.LastName} <br /> Tel : {data.User?.Phone || "ไม่ได้ระบุ"}</p>
                            <p style={{fontSize:'14px'}}>
                             วัน : {data.DayofWeek?.DayName} <br /> ระยะเวลา : {data.TeacherAppointment?.appointment_duration} <br />หัวข้อ : {data.TeacherAppointment?.title} <br />รายละเอียด : {data.TeacherAppointment?.description} <br />สถานที่ : {data.TeacherAppointment?.location}
                            </p>

                          </div>
                        </>
                    ))) : (
                        <>
                          <p style={{fontSize:'20px'}}>ไม่มีการนัดหมาย...</p>
                        </>
                )}
              </div>
            </div>
          )}

          {/* User Info */}
          <div className="stddashboard-user-info" onClick={toggleDropdown}>
            <span className="stddashboard-user-id">{username}</span>
            <span className="stddashboard-user-name">{`${firstName} ${lastName}`}</span>
            <img
              src={profileImageUrl}
              onError={(e) => {
                // TypeScript ช่วยไม่ให้เกิด error
                const target = e.target as HTMLImageElement;
                console.log("Image load failed. Using fallback avatar.");
                target.src = simpleAvatar;
              }}
              alt="User Avatar"
              className="stddashboard-user-avatar"
            />  
            <i
              className={`stddashboard-arrow ${isDropdownVisible ? "down" : "up"
                }`}
            ></i>
          </div>

          {/* Dropdown Menu */}
          {isDropdownVisible && (
            <div className="stddashboard-dropdown-menu">
              <button onClick={goToDashboard}>Dashboard</button>
              <button onClick={goToProfile}>Profile</button>
              {userRole === "3" && <button onClick={goToAdmin}>Admin</button>}
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>

      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
    </>
  );
};

export default Header;