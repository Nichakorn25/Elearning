import React from "react";
import "./SearchResultPopup.css";
import { CourseInterface } from "../../../Interface/IClassSchedule";

interface SearchResultsPopupProps {
  isVisible: boolean;
  onClose: () => void;
  results: CourseInterface[];
  onAddCourse: (course: CourseInterface) => void;
}

const SearchResultsPopup: React.FC<SearchResultsPopupProps> = ({
  isVisible,
  onClose,
  results,
  onAddCourse,
}) => {
  if (!isVisible) return null;

  return (
    <div className="search-results-popup__overlay">
      <div className="search-results-popup__container">
        <div className="search-results-popup__header">
          <h3>ผลการค้นหารายวิชา</h3>
          <button onClick={onClose}>&times;</button>
        </div>
        <div className="search-results-popup__content">
          {results.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>รหัสวิชา</th>
                  <th>ชื่อวิชา</th>
                  <th>หน่วยกิต</th>
                  <th>คำอธิบาย</th>
                  <th>เพิ่ม</th>
                </tr>
              </thead>
              <tbody>
                {results.map((course) => (
                  <tr key={course.ID}>
                    <td>{course.ID}</td>
                    <td>{course.CourseName}</td>
                    <td>{course.Credit}</td>
                    <td>{course.Description}</td>
                    <td>
                      <button onClick={() => onAddCourse(course)}>เพิ่ม</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>ไม่พบข้อมูลรายวิชา</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPopup;
