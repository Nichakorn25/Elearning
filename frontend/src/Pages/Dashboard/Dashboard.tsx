import React, { useState, useEffect } from "react";
//import { useNavigate } from 'react-router-dom';
import "./Dashboard.css";
import Sidebar from "../Component/Sidebar/Sidebar";
//import Slider from "react-slick"; // ใช้ react-slick
import Header from "../Component/Header/Header"; // เรียกใช้ Header ที่แยกไว้
import Course01 from "../../assets/course01.jpeg";
import Course02 from "../../assets/course02.jpeg";
import Course03 from "../../assets/course03.jpeg";
import Course04 from "../../assets/course04.jpeg";
import Course05 from "../../assets/course05.jpeg";
import Course06 from "../../assets/course06.jpeg";
import Course07 from "../../assets/course07.jpeg";
import Course08 from "../../assets/course08.jpeg";
import Course09 from "../../assets/course09.jpeg";
import Course10 from "../../assets/course10.jpeg";
import { GetAnnouncementById } from "../../services/https";

const Dashboard: React.FC = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [announcement, setAnnouncement] = useState<{
    title: string;
    content: string;
  } | null>(null);

  // ฟังก์ชันดึงข้อมูล Announcement โดย ID
  const fetchAnnouncement = async (id: string) => {
    try {
      const response = await GetAnnouncementById(id);
      if (response.status === 200) {
        setAnnouncement(response.data); // บันทึกข้อมูลใน state
      } else {
        console.error("Failed to fetch announcement:", response);
      }
    } catch (error) {
      console.error("Error fetching announcement:", error);
    }
  };

  // โหลดข้อมูลเมื่อ Component ถูกสร้าง
  useEffect(() => {
    fetchAnnouncement("1"); // เรียกฟังก์ชันพร้อม ID (เปลี่ยน ID ตามความเหมาะสม)
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible); // เปิด/ปิด Sidebar
  };

  // ตั้งค่า Slider
  const sliderSettings = {
    dots: true, // แสดงปุ่มบอกตำแหน่งของ Slide
    infinite: true, // เลื่อนไปเรื่อยๆ แบบไม่สิ้นสุด
    speed: 500, // ความเร็วในการเลื่อน (500ms)
    slidesToShow: 1, // แสดง 1 รูปต่อหน้า
    slidesToScroll: 1, // เลื่อนทีละ 1 รูป
    autoplay: true, // เลื่อนเองอัตโนมัติ
    autoplaySpeed: 3000, // ความเร็วของการเลื่อนอัตโนมัติ (3 วินาที)
  };

  return (
    <div className="stddashboard">
      {/* Header Section */}
      <Header />

      {/* Sidebar */}
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />

      {/* Slider */}
      {/* <div className="stddashboard-slider">
        <Slider {...sliderSettings}>
          <div>
            <img src={Course01} alt="Slide 1" className="stddashboard-slide-img" />
          </div>
          <div>
            <img src={Course02} alt="Slide 2" className="stddashboard-slide-img" />
          </div>
          <div>
            <img src={Course03} alt="Slide 3" className="stddashboard-slide-img" />
          </div>
          <div>
            <img src={Course04} alt="Slide 1" className="stddashboard-slide-img" />
          </div>
          <div>
            <img src={Course05} alt="Slide 2" className="stddashboard-slide-img" />
          </div>
          <div>
            <img src={Course06} alt="Slide 3" className="stddashboard-slide-img" />
          </div>
          <div>
            <img src={Course07} alt="Slide 1" className="stddashboard-slide-img" />
          </div>
          <div>
            <img src={Course08} alt="Slide 2" className="stddashboard-slide-img" />
          </div>
          <div>
            <img src={Course09} alt="Slide 3" className="stddashboard-slide-img" />
          </div>
        </Slider>
      </div> */}

      {/* Announcement Section */}
      <div className="announcement-section">
        <h2>Announcement</h2>
        {announcement && (
          <div className="announcement-card">
            <h3>{announcement.title}</h3>
            <p>{announcement.content}</p>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="stddashboard-search-bar">
        <input type="text" placeholder="ค้นหารายวิชา (Search courses)" />
        <button className="stddashboard-search-button">🔍</button>
      </div>

      {/* Your Courses Section */}
      <div className="stddashboard-your-courses">
        <h2>คอร์สเรียนของคุณ</h2>
        <div className="stddashboard-course-list">
          <div className="stddashboard-course-card">
            <img src={Course01} alt="Course 01" />
            <h3>ENG23 3054 OS</h3>
            <p>Asst. Dr. Prof...</p>
          </div>
          <div className="stddashboard-course-card">
            <img src={Course02} alt="Course 02" />
            <h3>ENG23 4041 CYBER</h3>
            <p>02/2567 ...</p>
          </div>
          <div className="stddashboard-course-card">
            <img src={Course03} alt="Course 03" />
            <h3>ENG23 4041 CYBER</h3>
            <p>02/2567 ...</p>
          </div>
          <div className="stddashboard-course-card">
            <img src={Course04} alt="Course 04" />
            <h3>ENG23 4041 CYBER</h3>
            <p>02/2567 ...</p>
          </div>
          <div className="stddashboard-course-card">
            <img src={Course09} alt="Course 04" />
            <h3>ENG23 4041 CYBER</h3>
            <p>02/2567 ...</p>
          </div>
        </div>
      </div>

      {/* Recommend Section */}
      <div className="stddashboard-recommend">
        <h2>แนะนำสำหรับคุณ</h2>
        <div className="stddashboard-course-list">
          <div className="stddashboard-course-card">
            <img src={Course05} alt="Course 01" />
            <h3>AI: Deep Learning</h3>
            <p>By Prof. Kobkiat Saraboon</p>
          </div>
          <div className="stddashboard-course-card">
            <img src={Course06} alt="Course 01" />
            <h3>Golang Backend</h3>
            <p>By Ruangyot Nanchiang</p>
          </div>
          <div className="stddashboard-course-card">
            <img src={Course07} alt="Course 01" />
            <h3>AI: Deep Learning</h3>
            <p>By Prof. Kobkiat Saraboon</p>
          </div>
          <div className="stddashboard-course-card">
            <img src={Course08} alt="Course 01" />
            <h3>Golang Backend</h3>
            <p>By Ruangyot Nanchiang</p>
          </div>
          <div className="stddashboard-course-card">
            <img src={Course10} alt="Course 01" />
            <h3>Golang Backend</h3>
            <p>By Ruangyot Nanchiang</p>
          </div>
        </div>
      </div>

      {/* แนะนำตามสาขาที่เรียน */}
      <div className="stddashboard-recommend">
        <h2>เนื่องจากคุณเป็นนักศึกษาสำนักวิชาวิศวกรรมศาสตร์</h2>
        <div className="stddashboard-course-list">
          <div className="stddashboard-course-card">
            <img src={Course05} alt="Course 01" />
            <h3>AI: Deep Learning</h3>
            <p>By Prof. Kobkiat Saraboon</p>
          </div>
          <div className="stddashboard-course-card">
            <img src={Course06} alt="Course 01" />
            <h3>Golang Backend</h3>
            <p>By Ruangyot Nanchiang</p>
          </div>
          <div className="stddashboard-course-card">
            <img src={Course07} alt="Course 01" />
            <h3>AI: Deep Learning</h3>
            <p>By Prof. Kobkiat Saraboon</p>
          </div>
          <div className="stddashboard-course-card">
            <img src={Course08} alt="Course 01" />
            <h3>Golang Backend</h3>
            <p>By Ruangyot Nanchiang</p>
          </div>
          <div className="stddashboard-course-card">
            <img src={Course10} alt="Course 01" />
            <h3>Golang Backend</h3>
            <p>By Ruangyot Nanchiang</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
