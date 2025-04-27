import React, { useState } from "react";
import "./AddSubjectPopup.css";
import SearchGuidePopup from "../SearchGuidePopup/SearchGuidePopup"; // Import popup สำหรับ "วิธีค้นหา"
import { SearchCourses } from "../../../services/https/index"; // Import ฟังก์ชัน searchCourse
import Loading from "../../Component/Loading/Loading"; // Import Loading animation
import { message } from "antd";
import SearchResultsPopup from "../SearchResultPopup/SearchResultPopup"; // Import Popup แสดงผลลัพธ์
import { CourseInterface } from "../../../Interface/IClassSchedule";

interface AddSubjectPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onAddCourse: (course: CourseInterface) => void;
}

const AddSubjectPopup: React.FC<AddSubjectPopupProps> = ({
  isVisible,
  onClose,
  onAddCourse,
}) => {
  const [isGuideVisible, setGuideVisible] = useState(false); // State สำหรับ popup วิธีค้นหา
  const [semester, setSemester] = useState("1"); // State สำหรับเทอม
  const [searchTerm, setSearchTerm] = useState(""); // State สำหรับคำค้นหา
  const [searchResults, setSearchResults] = useState<any[]>([]); // State สำหรับผลลัพธ์การค้นหา
  const [loading, setLoading] = useState<boolean>(false); // State สำหรับสถานะโหลด
  const [isResultsPopupVisible, setResultsPopupVisible] = useState(false); // State สำหรับแสดง/ซ่อน Popup ผลลัพธ์

  const toggleGuidePopup = () => {
    setGuideVisible(!isGuideVisible);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      message.error("กรุณากรอกคำค้นหา");
      return;
    }
    setLoading(true); // เริ่มโหลดข้อมูล

    try {
      const results = await SearchCourses(semester, searchTerm.trim()); // เรียก API พร้อมคำค้นหา
      setSearchResults(results); // เก็บผลลัพธ์การค้นหา
      setResultsPopupVisible(true); // แสดง Popup ผลลัพธ์
    } catch (error) {
      console.error("Error searching courses:", error);
      message.error("เกิดข้อผิดพลาดในการค้นหา");
    } finally {
      setLoading(false); // ปิดการโหลดข้อมูล
    }
  };

  if (!isVisible) return null;

  return (
    <div className="add-subject-popup__overlay">
      <div className="add-subject-popup__container">
        <div className="add-subject-popup__header">
          <h3>เพิ่มรายวิชา</h3>
          <button className="add-subject-popup__close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="add-subject-popup__content">
          {/* แสดง Loading หากกำลังโหลด */}
          {loading && (
            <>
              <div className="loading-overlay"></div>
              <Loading />
            </>
          )}

          <div className="add-subject-popup__form-inline">
            <span className="add-subject-popup__form-group">
              <label>ปีการศึกษา</label>
              <select>
                <option value="2567">2567</option>
                <option value="2566">2566</option>
              </select>
            </span>
            <span className="add-subject-popup__form-group">
              <label>เทอม</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </span>
          </div>
          <div className="add-subject-popup__form-group">
            <label>ค้นหาด้วย 'ชื่อวิชา'</label>
            <input
              type="text"
              placeholder="เช่น CALCULUS*"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="add-subject-popup__buttons">
            <button className="btn-search" onClick={handleSearch}>
              ค้นหา
            </button>
            <button className="btn-guide" onClick={toggleGuidePopup}>
              วิธีค้นหา
            </button>
          </div>
        </div>

        <div className="add-subject-popup__footer">
          <button className="btn-close" onClick={onClose}>
            ปิดหน้าต่าง
          </button>
        </div>

        {/* Popup "วิธีค้นหา" */}
        {isGuideVisible && <SearchGuidePopup onClose={toggleGuidePopup} />}

        {/* Popup แสดงผลลัพธ์ */}
        <SearchResultsPopup
          isVisible={isResultsPopupVisible}
          onClose={() => setResultsPopupVisible(false)}
          results={searchResults}
          onAddCourse={(course) => {
            const formattedCourse: CourseInterface = {
              ...course,
              CourseDate: course.CourseDate || "",
              CategoryID: course.CategoryID || 0,
              UserID: course.UserID || 0,
              SemesterID: course.SemesterID || 0,
              DayofWeekID: course.DayofWeekID || 0,
            };
            onAddCourse(formattedCourse);
          }}
        />
      </div>
    </div>
  );
};

export default AddSubjectPopup;