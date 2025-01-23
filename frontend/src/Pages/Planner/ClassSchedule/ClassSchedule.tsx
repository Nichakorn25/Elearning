import React, { useState, useEffect } from "react";
import "./ClassSchedule.css";
import Header from "../../Component/Header/Header";
import AddSubjectPopup from "../AddSubjectPopup/AddSubjectPopup";
import CreditSummary from "../CreditSummary/CreditSummary";
import {
  CourseInterface,
  StudyTimeInterface,
} from "../../../Interface/IClassSchedule";
import { message, Spin } from "antd";
import Swal from "sweetalert2";
import {
  GetClassScheduleById,
  AddClassSchedule,
  RemoveClassScheduleByCourseID,
  RemoveAllClassSchedules,
} from "../../../services/https";

const ClassSchedule: React.FC = () => {
  useEffect(() => {
    const fetchClassSchedule = async () => {
      try {
        const userId = localStorage.getItem("id");
        if (!userId) {
          Swal.fire("เกิดข้อผิดพลาด!", "ไม่พบข้อมูลผู้ใช้งานในระบบ", "error");
          return;
        }
    
        const data = await GetClassScheduleById(userId);
        console.log("Fetched Class Schedule:", data);
    
        if (!data || data.length === 0) {
          Swal.fire("ไม่มีข้อมูล!", "ไม่พบข้อมูลตารางเรียน", "info");
          return;
        }
    
        const updatedSchedule = [...schedule];
    
        const coursesFromApi: CourseInterface[] = data.map((item: any) => {
          const course = item.Course || {};
          const studyTimes = course.StudyTime || []; // ตรวจสอบ StudyTimes
          console.log("Course StudyTimes:", studyTimes);
    
          const dayRow = updatedSchedule.find(
            (row) => row.key === item.DayofWeekID
          );
    
          if (dayRow && studyTimes.length > 0) {
            studyTimes.forEach((time: StudyTimeInterface) => {
              const startHour = new Date(time.StudyTimeStart).getUTCHours();
              const endHour = new Date(time.StudyTimeEnd).getUTCHours();
    
              let timeFront = startHour - 8;
              let timeEnd = endHour - 8 - 1;
    
              for (let i = timeFront; i <= timeEnd; i++) {
                if (!dayRow.slots[i]) {
                  dayRow.slots[i] = {
                    courseName: course.CourseName || "Unknown Course",
                    color: getRandomColor(),
                  };
                } else {
                  console.warn(
                    `Time conflict at slot ${i} for ${course.CourseName}`
                  );
                }
              }
            });
          } else {
            console.warn(
              "No StudyTimes or invalid data for:",
              course.CourseName || "Unknown"
            );
          }
    
          return {
            ...course,
            DayofWeekID: item.DayofWeekID,
            SemesterID: course.SemesterID,
          };
        });
    
        setCourses(coursesFromApi);
        setSchedule(updatedSchedule);
      } catch (error) {
        console.error("Error fetching class schedule:", error);
        Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถโหลดตารางเรียนได้", "error");
      }
    };
    
    fetchClassSchedule();
  }, []); // จะถูกเรียกครั้งเดียวเมื่อเปิดหน้านี้

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

  const [, setAddtable] = useState<CourseInterface[]>([]);
  const [schedule, setSchedule] = useState([
    { day: "จันทร์", key: 2, slots: Array(timeslots.length).fill("") },
    { day: "อังคาร", key: 3, slots: Array(timeslots.length).fill("") },
    { day: "พุธ", key: 4, slots: Array(timeslots.length).fill("") },
    { day: "พฤหัส", key: 5, slots: Array(timeslots.length).fill("") },
    { day: "ศุกร์", key: 6, slots: Array(timeslots.length).fill("") },
  ]);
  const [courses, setCourses] = useState<CourseInterface[]>([]); // ใช้ CourseInterface
  const [isPopupVisible, setPopupVisible] = useState(false);

  const togglePopup = () => setPopupVisible(!isPopupVisible);
  const [usedColors, setUsedColors] = useState<string[]>([]);

  const colorTable = [
    "#FFCDD2", // Light Red
    "#F8BBD0", // Light Pink
    "#E1BEE7", // Light Purple
    "#D1C4E9", // Lavender
    "#BBDEFB", // Light Blue
    "#B3E5FC", // Aqua Blue
    "#B2DFDB", // Teal
    "#C8E6C9", // Light Green
    "#DCEDC8", // Lime Green
    "#FFF9C4", // Light Yellow
    "#FFECB3", // Light Orange
    "#FFE0B2", // Peach
  ];

  const getRandomColor = (): string => {
    const availableColors = colorTable.filter(
      (color) => !usedColors.includes(color)
    );
    if (availableColors.length === 0) {
      message.warning("สีถูกใช้งานหมดแล้ว");
      return "#FFFFFF"; // Default to white if no colors available
    }
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    return availableColors[randomIndex];
  };

  const populateSchedule = (course: CourseInterface) => {
    console.log("Adding course to schedule:", course);

    const conflicts: string[] = []; // เก็บข้อความเกี่ยวกับข้อขัดแย้ง
    const currentSemester = 1; // สมมติว่า currentSemester มาจาก state หรือ props
    const courseColor = getRandomColor();
    setUsedColors((prev) => [...prev, courseColor]);

    const updatedSchedule = [...schedule];

    // **ตรวจสอบว่า Course อยู่ในเทอมปัจจุบันหรือไม่**
    if (course.SemesterID !== currentSemester) {
      Swal.fire({
        title: "Semester Conflict!",
        text: `The course "${course.CourseName}" belongs to Semester ${course.SemesterID}, which is different from the current Semester (${currentSemester}).`,
        icon: "error",
        confirmButtonText: "OK",
      });
      return; // หยุดการเพิ่มวิชา
    }
    // ตรวจสอบเวลาเรียนซ้ำซ้อน
    course.StudyTimes.forEach(
      ({ StudyDay, StudyTimeStart, StudyTimeEnd }: StudyTimeInterface) => {
        const dayMapping: { [key: string]: string } = {
          Monday: "จันทร์",
          Tuesday: "อังคาร",
          Wednesday: "พุธ",
          Thursday: "พฤหัส",
          Friday: "ศุกร์",
        };

        const mappedDay = dayMapping[StudyDay];
        const dayRow = updatedSchedule.find((row) => row.day === mappedDay);

        if (dayRow) {
          const startDate = new Date(StudyTimeStart);
          const endDate = new Date(StudyTimeEnd);

          const startHour = startDate.getUTCHours();
          const endHour = endDate.getUTCHours();

          let timeFront = startHour - 8;
          let timeEnd = endHour - 8 - 1;

          if (
            timeFront >= 0 &&
            timeEnd >= 0 &&
            timeFront < timeslots.length &&
            timeEnd < timeslots.length
          ) {
            for (let i = timeFront; i <= timeEnd; i++) {
              if (dayRow.slots[i]) {
                // เก็บข้อขัดแย้งใน conflicts
                conflicts.push(
                  `Time conflict for ${course.CourseName} at slot ${timeslots[i]}`
                );
              } else {
                dayRow.slots[i] = {
                  courseName: course.CourseName,
                  color: courseColor,
                };
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
      }
    );

    // หากมี conflicts แสดง Swal และหยุดการเพิ่มวิชา
    if (conflicts.length > 0) {
      Swal.fire({
        title: "Time Conflict!",
        html: conflicts.join("<br>"), // แสดงข้อขัดแย้งแต่ละรายการ
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    console.log(updatedSchedule);
    setSchedule(updatedSchedule);

    // เพิ่มวิชาใน courses
    setCourses((prevCourses) => [
      ...prevCourses,
      {
        ...course,
        ID: course.ID || course.CourseID || 0, // ใช้ course.ID หรือ course.CourseID
        color: courseColor,
      },
    ]);
  };

  const handleReset = async () => {
    Swal.fire({
      title: "ยืนยันการรีเซ็ต",
      text: "คุณต้องการรีเซ็ตตารางเรียนทั้งหมดหรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#45B39D",
      cancelButtonColor: "#CD6155",
      confirmButtonText: "รีเซ็ต",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const userId = localStorage.getItem("id");
          if (!userId) {
            Swal.fire("เกิดข้อผิดพลาด!", "ไม่พบข้อมูลผู้ใช้งานในระบบ", "error");
            return;
          }
  
          // เรียก API ลบข้อมูลทั้งหมดในฐานข้อมูล
          await RemoveAllClassSchedules(userId);
  
          // ลบข้อมูลใน state
          setSchedule([
            { day: "จันทร์", key: 2, slots: Array(timeslots.length).fill("") },
            { day: "อังคาร", key: 3, slots: Array(timeslots.length).fill("") },
            { day: "พุธ", key: 4, slots: Array(timeslots.length).fill("") },
            { day: "พฤหัส", key: 5, slots: Array(timeslots.length).fill("") },
            { day: "ศุกร์", key: 6, slots: Array(timeslots.length).fill("") },
          ]);
          setCourses([]);
          setUsedColors([]);
  
          Swal.fire("รีเซ็ตสำเร็จ!", "ตารางเรียนถูกรีเซ็ตเรียบร้อยแล้ว", "success");
        } catch (error) {
          console.error("Error resetting schedule:", error);
          Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถรีเซ็ตตารางเรียนได้", "error");
        }
      }
    });
  };
  

  const handleRemoveCourse = async (id: number) => {
    const courseToRemove = courses.find((course) => course.ID === id);
    if (!courseToRemove) {
      console.error(`Course with ID ${id} not found`);
      return;
    }
  
    Swal.fire({
      title: "Are you sure?",
      text: `คุณต้องการลบวิชา ${courseToRemove.CourseName} ใช่ไหม`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#45B39D",
      cancelButtonColor: "#CD6155",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const userId = localStorage.getItem("id");
          if (!userId) {
            Swal.fire("เกิดข้อผิดพลาด!", "ไม่พบข้อมูลผู้ใช้งานในระบบ", "error");
            return;
          }
  
          // เรียก API ลบข้อมูล
          await RemoveClassScheduleByCourseID(id, userId);
  
          // ลบ course จาก state courses
          setCourses((prevCourses) =>
            prevCourses.filter((course) => course.ID !== id)
          );
  
          // ลบ slots ของ course ใน schedule
          const updatedSchedule = schedule.map((dayRow) => {
            const updatedSlots = dayRow.slots.map((slot) =>
              slot && slot.courseName === courseToRemove.CourseName ? "" : slot
            );
            return { ...dayRow, slots: updatedSlots };
          });
          setSchedule(updatedSchedule);
  
          Swal.fire(
            "Deleted!",
            "วิชาได้ถูกลบออกจากตารางเรียบร้อยแล้ว",
            "success"
          );
        } catch (error) {
          console.error("Error removing course:", error);
          Swal.fire(
            "Error!",
            "ไม่สามารถลบข้อมูลในฐานข้อมูลได้",
            "error"
          );
        }
      }
    });
  };
  

  const handleSave = async () => {
    Swal.fire({
      title: "ยืนยันการบันทึก",
      text: "คุณต้องการบันทึกตารางเรียนหรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#45B39D",
      cancelButtonColor: "#CD6155",
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const userId = localStorage.getItem("id");
          if (!userId) {
            Swal.fire("เกิดข้อผิดพลาด!", "ไม่พบข้อมูลผู้ใช้งานในระบบ", "error");
            return;
          }

          for (const course of courses) {
            const newSchedule = {
              CourseID: course.ID,
              UserID: parseInt(userId),
              DayofWeekID: course.DayofWeekID,
            };

            console.log("Data being sent to API:", newSchedule);
            await AddClassSchedule(newSchedule);
          }

          Swal.fire(
            "บันทึกสำเร็จ!",
            "ตารางเรียนถูกบันทึกเรียบร้อยแล้ว",
            "success"
          );
        } catch (error) {
          console.error("Error saving schedule:", error);
          Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถบันทึกตารางเรียนได้", "error");
        }
      }
    });
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="reset-container">
        <button className="reset-button" onClick={handleReset}>
          รีเซ็ตตาราง
        </button>
      </div>
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
                  <td
                    key={slotIndex}
                    style={{
                      backgroundColor:
                        slot && slot.color ? slot.color : "transparent",
                    }}
                  >
                    {slot && slot.courseName ? slot.courseName : ""}
                  </td>
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
