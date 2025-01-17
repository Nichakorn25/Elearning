import React, { useState } from "react";
import "./ClassSchedule.css";
import Header from "../../Component/Header/Header";
import AddSubjectPopup from "../AddSubjectPopup/AddSubjectPopup";
import CreditSummary from "../CreditSummary/CreditSummary";
import { CourseInterface, StudyTimeInterface } from "../../../Interface/IClassSchedule";
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

  const [addtable, setAddtable] = useState<CourseInterface[]>([]);
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

  const populateSchedule = (course: CourseInterface) => {
    console.log("Adding course to schedule:", course);

    setAddtable((prevAddtable) => [...prevAddtable, course]);
    setCourses((prevCourses) => [...prevCourses, course]);

    const updatedSchedule = [...schedule];

    course.StudyTimes.forEach(({ StudyDay, StudyTimeStart, StudyTimeEnd }: StudyTimeInterface) => {
        const dayMapping: { [key: string]: string } = {
            Monday: "จันทร์",
            Tuesday: "อังคาร",
            Wednesday: "พุธ",
            Thursday: "พฤหัส",
            Friday: "ศุกร์",
        };

        const mappedDay = dayMapping[StudyDay];
        console.log("Mapped Day:", mappedDay);

        const dayRow = updatedSchedule.find((row) => row.day === mappedDay);
        console.log("DayRow:", dayRow);

        if (dayRow) {
            const startDate = new Date(StudyTimeStart);
            const endDate = new Date(StudyTimeEnd);

            // ดึงชั่วโมงและนาทีจากเวลา
            const startHour = startDate.getUTCHours(); // ปรับเป็น UTC+7
            const endHour = endDate.getUTCHours();

            let timeFront = (startHour - 8); // คำนวณช่วงเวลาเริ่มต้นใน timeslots
            let timeEnd = (endHour - 8) - 1; // คำนวณช่วงเวลาสิ้นสุดใน timeslots

            console.log("Calculated timeFront:", timeFront, "timeEnd:", timeEnd);

            if (timeFront >= 0 && timeEnd >= 0 && timeFront < timeslots.length && timeEnd < timeslots.length) {
                for (let i = timeFront; i <= timeEnd; i++) {
                    if (!dayRow.slots[i]) {
                        dayRow.slots[i] = course.CourseName;
                    } else {
                        console.warn(
                            `Time conflict for ${course.CourseName} at slot ${timeslots[i]}`
                        );
                    }
                }
            } else {
                console.error(
                    `Time indices out of range for ${course.CourseName}: ${timeFront} - ${timeEnd}`
                );
            }
        } else {
            console.error(`Failed to map day for ${StudyDay}`);
        }
    });

    console.log("Updated Schedule:", updatedSchedule);
    setSchedule(updatedSchedule);
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

  const handleGetcourse = (course: any) => {
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
                <td className="day-name">{scheduleRow.day}</td>
                {scheduleRow.slots.map((slot, slotIndex) => (
                  <td key={slotIndex}>{slot || "-"}</td>
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
