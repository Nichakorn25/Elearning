import React, { useState, useEffect } from "react";
import "./StudentBooking.css";
import { Select, Input } from "antd";
import Header from "../../../Component/Header/Header";
import Calendar from "react-calendar";
import {
  GetDepartments,
  GetMajors,
  ListUsersFilters,
  SearchProfessors,
} from "../../../../services/https";
import { UserInterface } from "../../../../Interface/IUser";
import BookingPopup from "../BookingPopup/BookingPopup";

const { Option } = Select;
const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const StudentBooking: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null);
  const [professor, setProfessor] = useState<string | null>(null);
  const [searchProfessor, setSearchProfessor] = useState<string>(""); // ใช้ searchProfessor แทน
  const [departments, setDepartments] = useState<any[]>([]);
  const [majors, setMajors] = useState<any[]>([]);
  const [professors, setProfessors] = useState<UserInterface[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isBookingPopupVisible, setIsBookingPopupVisible] = useState(false);
  const [popupData, setPopupData] = useState<{
    date: string;
    time: string;
  } | null>(null);

  //const userRole = localStorage.getItem("role"); // RoleID: '1', '2', '3'
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Extract user data or set default values
  //const username = user?.username || "N/A";
  const firstName = user?.FirstName || "N/A";
  const lastName = user?.LastName || "N/A";

  // const [userName, setUserName] = useState<string | null>(null);
  // const [userSurname, setUserSurname] = useState<string | null>(null);

  // useEffect(() => {
  //   const userData = localStorage.getItem("id"); // ดึงข้อมูลจาก key "user"
  //   if (userData) {
  //     const parsedUser = JSON.parse(userData); // แปลงข้อมูลจาก JSON
  //     setUserName(parsedUser.firstName); // ตั้งชื่อผู้ใช้
  //     setUserSurname(parsedUser.lastName); // ตั้งนามสกุลผู้ใช้
  //   } else {
  //     setUserName("Guest");
  //     setUserSurname(""); // หากไม่มีข้อมูลใน localStorage
  //   }
  // }, []);

  // ดึงข้อมูล Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await GetDepartments();
        if (response && response.status === 200) {
          setDepartments(response.data);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  // ดึงข้อมูล Majors ตาม Department ที่เลือก
  useEffect(() => {
    const fetchMajors = async () => {
      if (selectedDepartment) {
        try {
          const response = await GetMajors(selectedDepartment);
          if (response && response.status === 200) {
            setMajors(response.data);
          } else {
            setMajors([]);
          }
        } catch (error) {
          console.error("Error fetching majors:", error);
          setMajors([]);
        }
      } else {
        setMajors([]);
      }
    };

    fetchMajors();
  }, [selectedDepartment]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await SearchProfessors(searchQuery);
      if (response && response.status === 200) {
        setProfessors(response.data); // เก็บผลลัพธ์ที่ค้นพบ
      } else {
        setProfessors([]); // หากไม่พบข้อมูล
      }
    } catch (error) {
      console.error("Error fetching professors:", error);
      setProfessors([]);
    } finally {
      setLoading(false);
    }
  };

  // ดึงข้อมูล Professors ตาม Major ที่เลือก
  const test = async (value: string) => {
    setSelectedMajor(value);
    try {
      const response = await ListUsersFilters(
        String(selectedDepartment),
        String(selectedMajor),
        String(2)
      );
      if (response.status === 200) {
        setProfessors(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching professors:", error);
      setProfessors([]);
    }
  };

  const timeSlots = [
    "9:00am",
    "10:00am",
    "11:00am",
    "12:00pm",
    "1:00pm",
    "2:00pm",
    "3:00pm",
    "9:00am",
  ];

  const getDatesForWeek = (weekOffset: number) => {
    const now = new Date();
    const startOfWeek = new Date(
      now.setDate(now.getDate() - now.getDay() + weekOffset * 7)
    );
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      return date;
    });
  };

  const handleSlotClick = (date: string, time: string) => {
    // กำหนดวันที่และเวลาที่เลือก
    setSelectedDate(date);
    setSelectedTime(time);
    setIsPopupVisible(true); // เปิด Popup
  };

  const handlePopupSubmit = (formData: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    // รวมข้อมูลการจอง
    const bookingData = {
      date: selectedDate,
      time: selectedTime,
      ...formData, // ข้อมูลที่กรอกจาก Popup
    };

    console.log("Booking Data:", bookingData);

    // คุณสามารถเพิ่มโค้ดสำหรับส่งข้อมูลไปยัง Backend ที่นี่
    // เช่น
    // await SaveBooking(bookingData);

    // ปิด Popup หลังจากบันทึกข้อมูลสำเร็จ
    setIsPopupVisible(false);
  };

  const handlePopupClose = () => {
    // ปิด Popup โดยไม่บันทึกข้อมูล
    setIsPopupVisible(false);
  };

  const dates = getDatesForWeek(currentWeek);
  const handlePrevWeek = () => setCurrentWeek((prev) => prev - 1);
  const handleNextWeek = () => setCurrentWeek((prev) => prev + 1);

  return (
    <div className="student-booking__container">
      <Header />
      <header className="student-booking__header">
        {/* ส่วนแสดงชื่อ Username */}
        <div className="student-booking__user-info">
          <span className="student-booking__user-avatar">
            {/* แสดงตัวอักษรแรกของ firstName หรือ "?" หากไม่มีข้อมูล */}
            {firstName ? firstName.charAt(0).toUpperCase() : "?"}
          </span>
          <div className="student-booking__user-details">
            <span className="student-booking__user-name">
              {firstName || "Guest"}
            </span>
            <span className="student-booking__user-surname">
              {lastName || ""}
            </span>
          </div>
          {/* ส่วน Title */}
          <div className="student-booking__title">
            <h1>Booking Appointment</h1>
            <p className="student-booking__subtitle">
              <span className="student-booking__icon">⏰</span> Select professor
              you want to make appointment
            </p>
          </div>
        </div>

        <div className="student-booking__search">
          {/* Search Bar */}
          <Input
            placeholder="Search Professor by Name"
            value={searchProfessor}
            onChange={(e) => setSearchProfessor(e.target.value)}
            className="student-booking__search-input"
          />
        </div>

        {/* Dropdowns */}
        <div className="student-booking__dropdowns">
          {/* Department Dropdown */}
          <Select
            placeholder="Select Department"
            value={selectedDepartment}
            onChange={(value) => setSelectedDepartment(value)}
            className="student-booking__select"
          >
            {departments.map((item) => (
              <Option key={item.ID} value={item.ID}>
                {item.DepartmentName}
              </Option>
            ))}
          </Select>

          {/* Major Dropdown */}
          <Select
            placeholder="Select Major"
            value={selectedMajor}
            onChange={(value) => test(value)}
            className="student-booking__select"
            disabled={!selectedDepartment}
          >
            {majors.map((item) => (
              <Option key={item.ID} value={item.ID}>
                {item.MajorName}
              </Option>
            ))}
          </Select>

          {/* Professor Dropdown */}
          <Select
            placeholder="Select Professor"
            value={professor}
            onChange={(value) => setProfessor(value)} // เชื่อมกับฟังก์ชันนี้
            className="student-booking__select"
            disabled={!selectedMajor} // ถ้าไม่มี Major จะ disabled
          >
            {professors.length > 0 ? (
              professors.map((item) => (
                <Option key={item.ID} value={item.ID}>
                  {item.FirstName} {item.LastName}
                </Option>
              ))
            ) : (
              <Option disabled>Select Professors</Option>
            )}
          </Select>
        </div>
      </header>

      <main className="student-booking__main">
        {/* Mini Calendar */}
        <section className="student-booking__mini-calendar">
          <div className="selectappointment">Select an appointment time</div>
          <div className="mini-calendar-container">
            <Calendar />
          </div>
        </section>

        {/* Time Slots */}
        <div>
          {/* Header (Calendar Header with Navigation) */}
          <div className="student-bookingcalendar-container">
            <div className="student-bookingcalendar-header">
              <button
                className="student-bookingcalendar-nav"
                onClick={handlePrevWeek}
              >
                &lt;
              </button>
              {dates.map((date, index) => (
                <div
                  key={index}
                  className="student-bookingcalendar-day-container"
                >
                  <div
                    className={`student-bookingcalendar-day ${
                      selectedDate === date.getDate()
                        ? "student-bookingcalendar-day--selected"
                        : ""
                    }`}
                    onClick={() => setSelectedDate(date.getDate())}
                  >
                    <span>{daysOfWeek[index]}</span>
                    <span>{date.getDate()}</span>
                  </div>
                  {/* Time Slots */}
                  {/* Time Slots */}
                  <div className="student-bookingcalendar-timeslots">
                    {timeSlots.map((slot, slotIndex) => (
                      <button
                        key={`${index}-${slotIndex}`}
                        className={`student-booking__timeslot ${
                          selectedDate === date.getDate() &&
                          selectedTime === slot
                            ? "student-booking__timeslot--selected"
                            : ""
                        }`}
                        onClick={() => {
                          // ตั้งค่าวันที่ที่เลือก
                          setSelectedDate(date.getDate());
                          setSelectedTime(slot);

                          // เตรียมข้อมูลสำหรับ Popup
                          setPopupData({
                            date: `${date.getFullYear()}-${String(
                              date.getMonth() + 1
                            ).padStart(2, "0")}-${String(
                              date.getDate()
                            ).padStart(2, "0")}`, // แปลงวันที่ให้ได้รูปแบบ YYYY-MM-DD
                            time: slot,
                          });

                          // เปิด Popup
                          setIsBookingPopupVisible(true);
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  <BookingPopup
                    visible={isBookingPopupVisible} // ควบคุมการแสดง Popup
                    onClose={() => setIsBookingPopupVisible(false)} // ปิด Popup
                    data={popupData} // ส่งข้อมูลวันที่และเวลาที่เลือกไปยัง Popup
                    onSubmit={(formData) => {
                      console.log("Booking data:", {
                        ...popupData,
                        ...formData,
                      });
                      setIsBookingPopupVisible(false);
                    }}
                  />
                  
                </div>
              ))}
              <button
                className="student-bookingcalendar-nav"
                onClick={handleNextWeek}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentBooking;
