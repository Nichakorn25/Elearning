import React from "react";
import "./CreditSummary.css";

interface Course {
  ID: number;
  CourseName: string;
  Credit: number;
  Description: string;
}

interface CreditSummaryProps {
  courses: Course[];
}

const CreditSummary: React.FC<CreditSummaryProps> = ({ courses }) => {
  return (
    <section className="credit-summary">
      <h2>หน่วยกิตรวม {courses.reduce((sum, course) => sum + course.Credit, 0)}</h2>
      <table>
        <thead>
          <tr>
            <th>รหัสวิชา</th>
            <th>ชื่อวิชา</th>
            <th>หน่วยกิต</th>
            <th>คำอธิบาย</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.ID}>
              <td>{course.ID}</td>
              <td>{course.CourseName}</td>
              <td>{course.Credit}</td>
              <td>{course.Description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default CreditSummary;
