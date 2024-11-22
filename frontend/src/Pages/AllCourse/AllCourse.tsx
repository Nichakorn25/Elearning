import React from 'react';
import './AllCourse.css'; // ไฟล์ CSS สำหรับหน้า AllCourses
import HeaderBeforeLogin from '../Component/HeaderBeforeLogin/HeaderBeforeLogin'; // Import Header

const AllCourses: React.FC = () => {
  const handleLoginClick = () => {
    console.log("Login button clicked!");
    // คุณสามารถเพิ่มการทำงานเพิ่มเติมเมื่อปุ่ม "เข้าสู่ระบบ" ถูกกด
  };

  return (
    <div>
      {/* เรียกใช้ Header */}
      <HeaderBeforeLogin onLoginClick={handleLoginClick} />

      <div className="all-courses-container">
        <h1>SUT e-Learning</h1>
        <p>หน้าหลัก / รายวิชาทั้งหมด</p>
        <div className="search-container">
          <input
            type="text"
            placeholder="ค้นหารายวิชา"
            className="search-input"
          />
          <button className="search-button">🔍</button>
        </div>
      </div>

        {/* ค้นหารายวิชา */}
      <div className='allmajor'>
        {/* รายการหมวดหมู่รายวิชา */}
        <ul className="course-list">
          <li>สำนักวิชาวิทยาศาสตร์ (Institute of Science)</li>
          <li>สำนักวิชาเทคโนโลยีการเกษตร (Institute of Agricultural Technology)</li>
          <li>สำนักวิชาเทคโนโลยีสังคม (Institute of Social Technology)</li>
          <li>สำนักวิชาวิศวกรรมศาสตร์ (Institute of Engineering)</li>
          <li>สำนักวิชาพยาบาลศาสตร์ (Institute of Nursing)</li>
          <li>สำนักวิชาแพทยศาสตร์ (Institute of Medicine)</li>
          <li>สำนักวิชาทันตแพทยศาสตร์ (Institute of Dentistry)</li>
          <li>สำนักวิชาสาธารณสุขศาสตร์ (Institute of Public Health)</li>
        </ul>
      </div>
        
      
    </div>
  );
};

export default AllCourses;
