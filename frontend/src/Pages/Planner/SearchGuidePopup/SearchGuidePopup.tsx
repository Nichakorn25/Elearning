import React from "react";
import "./SearchGuidePopup.css";

interface SearchGuidePopupProps {
  onClose: () => void;
}

const SearchGuidePopup: React.FC<SearchGuidePopupProps> = ({ onClose }) => {
  return (
    <div className="search-guide-popup__overlay">
      <div className="search-guide-popup__container">
        <div className="search-guide-popup__header">
          <h3>วิธีค้นหารายวิชา</h3>
          <button className="search-guide-popup__close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="explainhowtosearch">
            <h4>*สามารถค้นหารายวิชาจาก (รหัสวิชา) หรือ (ชื่อวิชา) หรือ (ทั้งสอง) ได้ จากนั้นจึงค่อยกดปุ่มค้นหา</h4>
        </div>
        <div className="search-guide-popup__content">
          <p>
            <strong className="text-highlight"><h3>ตัวอย่างการค้นหารายวิชา</h3></strong>
          </p>
          <ul>
            <li>
              ค้นหารายวิชาที่มีรหัสขึ้นต้นด้วย <strong>102</strong> ป้อน <strong>102*</strong> ลงในช่องรหัสวิชา
            </li>
            <li>
              ค้นหารายวิชาที่มีคำว่า <strong>world</strong> เป็นส่วนหนึ่งของชื่อวิชา ป้อน <strong>*world*</strong> ลงในช่องชื่อวิชา
            </li>
            <li>
              ค้นหารายวิชาที่มีชื่อวิชาลงท้ายด้วย <strong>finance</strong> ป้อน <strong>*finance</strong> ลงในช่องชื่อวิชา
            </li>
            <li>
              ค้นหารายวิชาที่มีรหัสขึ้นต้นด้วย <strong>102</strong> และชื่อวิชาลงท้ายด้วย <strong>world</strong> ป้อน{" "}
              <strong>102*</strong> ลงในช่องรหัสวิชา และป้อน <strong>*world</strong> ลงในช่องชื่อวิชา
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchGuidePopup;
