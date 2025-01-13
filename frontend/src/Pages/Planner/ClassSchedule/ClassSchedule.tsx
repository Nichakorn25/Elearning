import React, { useState } from 'react';
import './ClassSchedule.css';
import Header from '../../Component/Header/Header';
import AddSubjectPopup from '../AddSubjectPopup/AddSubjectPopup';
import CreditSummary from '../CreditSummary/CreditSummary';
import { CourseInterface } from '../../../Interface/IClassSchedule';
import {message} from 'antd';

const ClassSchedule: React.FC = () => {
  const timeslots = [
    '08:00-09:00',
    '09:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '12:00-13:00',
    '13:00-14:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00',
    '17:00-18:00',
    '18:00-19:00',
    '19:00-20:00',
  ];

  const [schedule, setSchedule] = useState(
    [
      { day: 'จันทร์', slots: Array(timeslots.length).fill('') },
      { day: 'อังคาร', slots: Array(timeslots.length).fill('') },
      { day: 'พุธ', slots: Array(timeslots.length).fill('') },
      { day: 'พฤหัส', slots: Array(timeslots.length).fill('') },
      { day: 'ศุกร์', slots: Array(timeslots.length).fill('') },
    ]
  );

  const [courses, setCourses] = useState<CourseInterface[]>([]); // ใช้ CourseInterface
  const [isPopupVisible, setPopupVisible] = useState(false);

  const togglePopup = () => setPopupVisible(!isPopupVisible);

  const handleAddCourse = (course: CourseInterface) => {
    // ตรวจสอบการซ้อนทับของเวลา
    const dayRow = schedule.find((row) => row.day === course.Day);
    if (dayRow) {
      const startIndex = timeslots.findIndex((time) => time === course.StartTime);
      const endIndex = timeslots.findIndex((time) => time === course.EndTime);

      for (let i = startIndex; i <= endIndex; i++) {
        if (dayRow.slots[i]) {
          message.error(`เวลาเรียนของ ${course.CourseName} ซ้อนกับ ${dayRow.slots[i]}`);
          return;
        }
      }
    }

    // เพิ่มข้อมูลลงตาราง CreditSummary
    setCourses((prevCourses) => [...prevCourses, course]);

    // อัปเดตตารางเรียน
    const newSchedule = schedule.map((dayRow) => {
      if (dayRow.day === course.Day) {
        const updatedSlots = [...dayRow.slots];
        const startIndex = timeslots.findIndex((time) => time === course.StartTime);
        const endIndex = timeslots.findIndex((time) => time === course.EndTime);

        for (let i = startIndex; i <= endIndex; i++) {
          updatedSlots[i] = course.CourseName;
        }
        return { ...dayRow, slots: updatedSlots };
      }
      return dayRow;
    });

    setSchedule(newSchedule);
  };

  const handleRemoveCourse = (id: number) => {
    // ลบวิชาออกจาก courses
    setCourses((prevCourses) => prevCourses.filter((course) => course.ID !== id));
  
    // อัปเดตตารางเรียน
    const updatedSchedule = schedule.map((dayRow) => {
      const updatedSlots = dayRow.slots.map((slot) =>
        courses.find((course) => course.ID === id && course.CourseName === slot) ? "" : slot
      );
      return { ...dayRow, slots: updatedSlots };
    });
  
    setSchedule(updatedSchedule);
  };

  const handleSave = () => {
    console.log('Saving schedule...', schedule);
    message.success('ตารางเรียนถูกบันทึก!');
  };

  return (
    <div className="dashboard">
      <Header />
      <section className="schedule-table">
        <h2>ตารางเรียน</h2>
        <table>
          <thead>
            <tr>
              <th>Day</th>
              {timeslots.map((slot, index) => (
                <th key={index}>{slot}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="day-name">{row.day}</td>
                {row.slots.map((slot, slotIndex) => (
                  <td key={slotIndex}>{slot}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <footer className="footer">
        <button className="save-button" onClick={handleSave}>
          บันทึกตาราง
        </button>
        <button className="add-course-button" onClick={togglePopup}>
          เพิ่มวิชา
        </button>
      </footer>
      // CreditSummary Component
      <CreditSummary courses={courses} onRemoveCourse={handleRemoveCourse} />
      <AddSubjectPopup isVisible={isPopupVisible} onClose={togglePopup} onAddCourse={handleAddCourse} />
    </div>
  );
};

export default ClassSchedule;
