import React, { useState,useEffect } from "react";
import "./ClassSchedule.css";
import Header from "../../Component/Header/Header";
import AddSubjectPopup from "../AddSubjectPopup/AddSubjectPopup";
import CreditSummary from "../CreditSummary/CreditSummary";
import {
  CourseInterface,
  StudyTimeInterface,
} from "../../../Interface/IClassSchedule";
import { message , Spin } from "antd";
import Swal from "sweetalert2";
import { GetClassScheduleById , AddClassSchedule } from "../../../services/https";

const ClassSchedule: React.FC = () => {

  useEffect(() => {
    const fetchClassSchedule = async () => {
      try {
        // ดึง UserID จาก LocalStorage
        const userId = localStorage.getItem("id");
        if (!userId) {
          Swal.fire("เกิดข้อผิดพลาด!", "ไม่พบข้อมูลผู้ใช้งานในระบบ", "error");
          return;
        }
  
        // เรียก API เพื่อดึงข้อมูลตารางเรียน
        const data = await GetClassScheduleById(userId);
        console.log("Fetched Class Schedule:", data);
  
        // ประมวลผลข้อมูลที่ได้รับจาก API
        const updatedSchedule = [...schedule];
        const coursesFromApi: CourseInterface[] = data.map((item: any) => {
          const dayRow = updatedSchedule.find((row) => row.key === item.DayofWeekID);
          if (dayRow) {
            item.StudyTimes.forEach((time: StudyTimeInterface) => {
              const startHour = new Date(time.StudyTimeStart).getUTCHours();
              const endHour = new Date(time.StudyTimeEnd).getUTCHours();
  
              let timeFront = startHour - 8;
              let timeEnd = endHour - 8 - 1;
  
              for (let i = timeFront; i <= timeEnd; i++) {
                dayRow.slots[i] = {
                  courseName: item.CourseName,
                  color: getRandomColor(),
                };
              }
            });
          }
          return item; // เก็บข้อมูล course สำหรับ state courses
        });
  
        setCourses(coursesFromApi); // เก็บ courses ใน state
        setSchedule(updatedSchedule); // อัปเดตตารางเรียน
      } catch (error) {
        console.error("Error fetching class schedule:", error);
        Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถโหลดตารางเรียนได้", "error");
      }
    };
  
    fetchClassSchedule();
  }, []); // useEffect ที่โหลดครั้งเดียว
  
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

    const courseColor = getRandomColor();
    setUsedColors((prev) => [...prev, courseColor]);

    // เพิ่มสีให้กับ course
    const updatedCourse = { ...course, color: courseColor };

    const updatedSchedule = [...schedule];

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
              if (!dayRow.slots[i]) {
                dayRow.slots[i] = {
                  courseName: course.CourseName,
                  color: courseColor,
                };
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
      }
    );
    console.log(updatedSchedule);
    setSchedule(updatedSchedule);

    // เพิ่มวิชาใน courses
    setCourses((prevCourses) => [
      ...prevCourses,
      { ...course, color: courseColor },
    ]);
  };

  const handleReset = () => {
    Swal.fire({
      title: "ยืนยันการรีเซ็ต",
      text: "คุณต้องการรีเซ็ตตารางเรียนทั้งหมดหรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#45B39D",
      cancelButtonColor: "#CD6155",
      confirmButtonText: "รีเซ็ต",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        setSchedule([
          { day: "จันทร์", key: 2, slots: Array(timeslots.length).fill("") },
          { day: "อังคาร", key: 3, slots: Array(timeslots.length).fill("") },
          { day: "พุธ", key: 4, slots: Array(timeslots.length).fill("") },
          { day: "พฤหัส", key: 5, slots: Array(timeslots.length).fill("") },
          { day: "ศุกร์", key: 6, slots: Array(timeslots.length).fill("") },
        ]);
        setCourses([]);
        setUsedColors([]);
        Swal.fire(
          "รีเซ็ตสำเร็จ!",
          "ตารางเรียนถูกรีเซ็ตเรียบร้อยแล้ว",
          "success"
        );
      }
    });
  };

  const handleRemoveCourse = (id: number) => {
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
    }).then((result) => {
      if (result.isConfirmed) {
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course.ID !== id)
        );
        setUsedColors((prevColors) =>
          prevColors.filter((color) => color !== courseToRemove.color)
        );
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
      }
    });
  };

  const handleSave = () => {
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
          // ดึง UserID จาก LocalStorage
          const userId = localStorage.getItem("id");
          if (!userId) {
            Swal.fire("เกิดข้อผิดพลาด!", "ไม่พบข้อมูลผู้ใช้งานในระบบ", "error");
            return;
          }
  
          // Loop ผ่าน courses ที่เพิ่มใหม่ แล้วส่ง API
          for (const course of courses) {
            // ค้นหา DayofWeekID จาก StudyDay
            const dayofWeek = schedule.find((row) => row.day === course.StudyDay);
  
            if (!dayofWeek) {
              Swal.fire(
                "เกิดข้อผิดพลาด!",
                `ไม่สามารถกำหนดวันสำหรับวิชา ${course.CourseName}`,
                "error"
              );
              continue; // ข้ามไปยังรอบถัดไป
            }
  
            const newSchedule = {
              CourseID: course.ID,
              UserID: parseInt(userId), // แปลง UserID เป็นตัวเลข
              DayofWeekID: dayofWeek.key, // ดึง key จาก schedule
            };
  
            console.log("Preparing to save schedule:", newSchedule); // ตรวจสอบค่า
  
            await AddClassSchedule(newSchedule); // เรียก API เพิ่มตารางเรียน
            console.log(newSchedule);
          }
  
          Swal.fire("บันทึกสำเร็จ!", "ตารางเรียนถูกบันทึกเรียบร้อยแล้ว", "success");
        } catch (error) {
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
