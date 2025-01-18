import React from "react";
import "./CreditSummary.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

interface ExamSchedule {
  ExamDate: string;
  StartTime: string;
  EndTime: string;
  Location: string;
}

interface Course {
  ID: number;
  CourseName: string;
  Credit: number;
  Description: string;
  color?: string; // เพิ่ม property สี
  ExamSchedules?: ExamSchedule[];
}

interface CreditSummaryProps {
  courses: Course[];
  onRemoveCourse: (id: number) => void; // เพิ่ม props สำหรับลบวิชา
}

const CreditSummary: React.FC<CreditSummaryProps> = ({
  courses,
  onRemoveCourse,
}) => {
  return (
    <section className="credit-summary">
      <h2>
        หน่วยกิตรวม {courses.reduce((sum, course) => sum + course.Credit, 0)}
      </h2>
      <table>
        <thead>
          <tr>
            <th>รหัสวิชา</th>
            <th>ชื่อวิชา</th>
            <th>หน่วยกิต</th>
            <th>คำอธิบาย</th>
            <th>ตารางสอบ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.ID}>
              <td
                style={{
                  backgroundColor: course.color || "transparent", // ใช้สีจาก course.color หรือโปร่งใส
                  color: "#000", // สีตัวอักษร
                  padding: "5px",
                  borderRadius: "4px", // มุมโค้ง
                }}
              >
                {course.ID}
              </td>

              <td>{course.CourseName}</td>
              <td>{course.Credit}</td>
              <td>{course.Description}</td>
              <td>
                {course.ExamSchedules && course.ExamSchedules.length > 0 ? (
                  <ul>
                    {course.ExamSchedules.map((exam, index) => (
                      <li key={index}>
                        <strong>วันที่:</strong> {exam.ExamDate} <br />
                        <strong>เวลา:</strong> {exam.StartTime} - {exam.EndTime}{" "}
                        <br />
                        <strong>สถานที่:</strong> {exam.Location}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>ไม่มีตารางสอบ</span>
                )}
              </td>
              <td>
                <button
                  className="delete-icon-button"
                  onClick={() => {
                    console.log("Deleting course ID:", course.ID); // ตรวจสอบ ID ที่ต้องการลบ
                    onRemoveCourse(course.ID); // ลบคอร์สตาม ID
                  }}
                >
                  <i className="fas fa-trash delete-icon"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default CreditSummary;
