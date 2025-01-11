import React , { useState } from "react";
import "./AddSubjectPopup.css";
import SearchGuidePopup from "../SearchGuidePopup/SearchGuidePopup"; // Import popup สำหรับ "วิธีค้นหา"

interface AddSubjectPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

const AddSubjectPopup: React.FC<AddSubjectPopupProps> = ({ isVisible, onClose }) => {
  const [isGuideVisible, setGuideVisible] = useState(false); // State สำหรับ popup วิธีค้นหา

  const toggleGuidePopup = () => {
    setGuideVisible(!isGuideVisible);
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
    <select>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
  </span>
</div>
          {/* <div className="add-subject-popup__form-group">
            <label>ค้นหาด้วย 'รหัสวิชา'</label>
            <input type="text" placeholder="เช่น SCI03 1001 หรือ 523101" />
          </div> */}
          <div className="add-subject-popup__form-group">
            <label>ค้นหาด้วย 'ชื่อวิชา'</label>
            <input type="text" placeholder="เช่น CALCULUS*" />
          </div>
          <div className="add-subject-popup__buttons">
            <button className="btn-search">ค้นหา</button>
            <button className="btn-guide" onClick={toggleGuidePopup}>วิธีค้นหา</button>
          </div>
          {/* <div className="add-subject-popup__alert">
            <strong>ประกาศ:</strong> ตรวจสอบรายวิชาที่เปลี่ยนแปลงรหัสใหม่ เทอม 2 ปี 2567 ได้ที่ 
            <a href="#">คลิกที่นี่</a>
          </div> */}
        </div>
        <div className="add-subject-popup__footer">
          <button className="btn-close" onClick={onClose}>ปิดหน้าต่าง</button>
        </div>
      </div>
      {/* Popup "วิธีค้นหา" */}
      {isGuideVisible && <SearchGuidePopup onClose={toggleGuidePopup} />}
    </div>
  );
};

export default AddSubjectPopup;
