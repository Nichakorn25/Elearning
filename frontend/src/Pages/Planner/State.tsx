import React, { useState } from "react";
import CreditSummary from "./CreditSummary/CreditSummary";
import SearchResultsPopup from "./SearchResultPopup/SearchResultPopup";

interface Course {
  ID: number;
  CourseName: string;
  Credit: number;
  Description: string;
  Category: string;
  Status: string;
}

const State: React.FC = () => {
  const [addedCourses, setAddedCourses] = useState<Course[]>([]); // เก็บรายวิชาที่เพิ่ม
  const [searchResults, setSearchResults] = useState<Course[]>([]); // เก็บผลลัพธ์การค้นหา
  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleAddCourse = (course: Course) => {
    // ตรวจสอบว่ารายวิชาไม่ซ้ำกัน
    if (!addedCourses.find((c) => c.ID === course.ID)) {
      setAddedCourses([...addedCourses, course]);
    }
  };

  return (
    <div>
      <button onClick={() => setPopupVisible(true)}>ค้นหารายวิชา</button>

      {/* คอมโพเนนต์ CreditSummary */}
      <CreditSummary courses={addedCourses} />

      {/* Popup สำหรับค้นหา */}
      <SearchResultsPopup
        isVisible={isPopupVisible}
        onClose={() => setPopupVisible(false)}
        results={searchResults}
        onAddCourse={handleAddCourse}
      />
    </div>
  );
};

export default State;
