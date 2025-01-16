import React, { useEffect, useState } from "react";
import "./ClassSchedule.css";
import Header from "../../Component/Header/Header";
import AddSubjectPopup from "../AddSubjectPopup/AddSubjectPopup";
import CreditSummary from "../CreditSummary/CreditSummary";
import { CourseInterface } from "../../../Interface/IClassSchedule";
import { message } from "antd";


const ClassSchedule: React.FC = () => {
  const timeslots = [
    "08:00-09:00",
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-13:00",
    "13:00-14:00",
    "14:00-15:00",
    "15:00-16:00",
    "16:00-17:00",
    "17:00-18:00",
    "18:00-19:00",
    "19:00-20:00",
  ];

  useEffect(() => {
      console.log(addtable)
    }, []);


  const [addtable, setAddtable] = useState([
    {key:1,day:1},
  ]);
  const [schedule, setSchedule] = useState([
    { day: "จันทร์", key: 2, slots: Array(timeslots.length).fill("") },
    { day: "อังคาร", key: 3, slots: Array(timeslots.length).fill("") },
    { day: "พุธ", key: 4, slots: Array(timeslots.length).fill("") },
    { day: "พฤหัส", key: 5, slots: Array(timeslots.length).fill("") },
    { day: "ศุกร์", key: 6, slots: Array(timeslots.length).fill("") },
  ]);

  const days = ["จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์"];

  const [courses, setCourses] = useState<CourseInterface[]>([]); // ใช้ CourseInterface
  const [isPopupVisible, setPopupVisible] = useState(false);

  const togglePopup = () => setPopupVisible(!isPopupVisible);

  // const handleAddCourse = (course: CourseInterface) => {
  //   // ตรวจสอบการซ้อนทับของเวลา
  //   const dayRow = schedule.find((row) => row.day === course.Day);
  //   if (dayRow) {
  //     const startIndex = timeslots.findIndex((time) => time === course.StartTime);
  //     const endIndex = timeslots.findIndex((time) => time === course.EndTime);

  //     for (let i = startIndex; i <= endIndex; i++) {
  //       if (dayRow.slots[i]) {
  //         message.error(`เวลาเรียนของ ${course.CourseName} ซ้อนกับ ${dayRow.slots[i]}`);
  //         return;
  //       }
  //     }
  //   }

  //   // เพิ่มข้อมูลลงตาราง CreditSummary
  //   setCourses((prevCourses) => [...prevCourses, course]);

  //   // อัปเดตตารางเรียน
  //   const newSchedule = schedule.map((dayRow) => {
  //     if (dayRow.day === course.Day) {
  //       const updatedSlots = [...dayRow.slots];
  //       const startIndex = timeslots.findIndex((time) => time === course.StartTime);
  //       const endIndex = timeslots.findIndex((time) => time === course.EndTime);

  //       for (let i = startIndex; i <= endIndex; i++) {
  //         updatedSlots[i] = course.CourseName;
  //       }
  //       return { ...dayRow, slots: updatedSlots };
  //     }

  //     return dayRow;
  //   });
  //   console.log(newSchedule)
  //   setSchedule(newSchedule);
  // };

  const populateSchedule = (courses) => {

    const updateAddtable = [...addtable, courses]; // Clone the existing schedule table

    // Iterating through the courses
    updateAddtable.forEach(({ DayofWeekID, StudyTimes, CourseName }) => {
      // Match the day in schedule using DayofWeekID
      const dayIndex = updateAddtable.findIndex(
        (item) => item.key === DayofWeekID
      );

      if (dayIndex !== -1) {
        // Map StudyTimes to schedule
        StudyTimes.forEach(({ StudyTimeStart, StudyTimeEnd }) => {
          // Extract hours from start and end times
          const startHour = new Date(StudyTimeStart).getHours();
          const endHour = new Date(StudyTimeEnd).getHours();

          // Find corresponding slots in timeslots
          const startIndex = timeslots.findIndex((slot) =>
            slot.startsWith(`${startHour.toString().padStart(2, "0")}:`)
          );
          const endIndex = timeslots.findIndex((slot) =>
            slot.startsWith(`${endHour.toString().padStart(2, "0")}:`)
          );

          // Fill the slots with the course name
          if (startIndex !== -1 && endIndex !== -1) {
            for (let i = startIndex; i < endIndex; i++) {
              updateAddtable[dayIndex].slots[i] = CourseName;
            }
          }
        });
      }
    });
    console.log(updateAddtable);
    setAddtable(updateAddtable); // Update the state
  };

  const handleRemoveCourse = (id: number) => {
    // ลบวิชาออกจาก courses
    setCourses((prevCourses) =>
      prevCourses.filter((course) => course.ID !== id)
    );

    // อัปเดตตารางเรียน
    const updatedSchedule = schedule.map((dayRow) => {
      const updatedSlots = dayRow.slots.map((slot) =>
        courses.find((course) => course.ID === id && course.CourseName === slot)
          ? ""
          : slot
      );
      return { ...dayRow, slots: updatedSlots };
    });
    console.log(updatedSchedule);
  };

  const handleSave = () => {
    console.log("Saving schedule...", schedule);
    message.success("ตารางเรียนถูกบันทึก!");
  };

  const handleGetcourse = (course) => {
    console.log(course);
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
            {schedule.map((scheduleRow, rowIndex) => (
              <tr key={rowIndex}>
                {/* คอลัมน์ซ้ายสุด: แสดงชื่อวัน */}
                <td className="day-name">{scheduleRow.day}</td>
                {/* คอลัมน์เวลาที่ตรงกับข้อมูลใน addtable */}
                {timeslots.map((timeslot, slotIndex) => {
                  // ตรวจสอบข้อมูลใน addtable
                  const matchedCourse = addtable.find(
                    (row) =>
                      row.StudyTimes &&
                      row.StudyTimes[0]?.StudyDay === scheduleRow.day &&
                      new Date(row.StudyTimes[0]?.StudyTimeStart).getHours() ===
                        parseInt(timeslot.split(":")[0]) &&
                      new Date(row.StudyTimes[0]?.StudyTimeEnd).getHours() ===
                        parseInt(timeslot.split("-")[1].split(":")[0])
                  );

                  // แสดงชื่อคอร์สหรือเครื่องหมาย "-" ถ้าไม่มีข้อมูล
                  return (
                    <td key={slotIndex}>
                      {matchedCourse ? matchedCourse.CourseName : "-"}
                    </td>
                  );
                })}
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
      {/* // CreditSummary Component */}
      <CreditSummary courses={courses} onRemoveCourse={handleRemoveCourse} />
      <AddSubjectPopup
        isVisible={isPopupVisible}
        onClose={togglePopup}
        onAddCourse={populateSchedule}
      />
    </div>
  );
};

export default ClassSchedule;
