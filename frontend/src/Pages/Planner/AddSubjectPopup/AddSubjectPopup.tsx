import React from "react";
import "./AddSubjectPopup.css";

interface AddSubjectPopupProps {
  isVisible: boolean; // ใช้สำหรับควบคุมการแสดงผล
  onClose: () => void; // ฟังก์ชันสำหรับปิด Popup
}

const AddSubjectPopup: React.FC<AddSubjectPopupProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null; // ถ้า isVisible เป็น false ให้ return null (ไม่แสดงอะไรเลย)

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
          <div className="add-subject-popup__form-group">
            <label>ปีการศึกษา</label>
            <select>
              <option value="2567">2567</option>
              <option value="2566">2566</option>
            </select>
          </div>
          <div className="add-subject-popup__form-group">
            <label>เทอม</label>
            <select>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
          <div className="add-subject-popup__form-group">
            <label>ค้นหาด้วย 'รหัสวิชา'</label>
            <input type="text" placeholder="เช่น SC103 1001 หรือ 523101" />
          </div>
          <div className="add-subject-popup__form-group">
            <label>หรือค้นหาด้วย 'ชื่อวิชา'</label>
            <input type="text" placeholder="เช่น CALCULUS*" />
          </div>
          <div className="add-subject-popup__footer">
            <button className="add-subject-popup__close-footer-button" onClick={onClose}>
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubjectPopup;
