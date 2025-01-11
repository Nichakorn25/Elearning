import React, { useState, useEffect } from "react";
import "./StudentBooking.css";
import { Select, Input, message } from "antd";
import Header from "../../../Component/Header/Header";
import Calendar from "react-calendar";
import {
  CreateStudentBooking,
  GetDepartments,
  GetMajors,
  ListUsersFilters,
  SearchProfessors,
} from "../../../../services/https";
import { UserInterface } from "../../../../Interface/IUser";
import BookingPopup from "../BookingPopup/BookingPopup";
import { GetTeacherAppointments } from "../../../../services/https";
import {
  StudentBookingInterface,
  TeacherAppointmentInterface,
} from "../../../../Interface/IAppointment";

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
  const [appointments, setAppointments] = useState<
    TeacherAppointmentInterface[]
  >([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false); // ควบคุมการแสดงผล Dropdown
  const [isBookingPopupVisible, setIsBookingPopupVisible] = useState(false);
  const [popupData, setPopupData] = useState<{
    date: string;
    time: string;
    appointmentId: number;
  } | null>(null);

  const [selectedProfessor, setSelectedProfessor] = useState<string | null>(
    null
  );

  //const userRole = localStorage.getItem("role"); // RoleID: '1', '2', '3'
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userIdstr = localStorage.getItem("id");
  
  // Extract user data or set default values
  //const username = user?.username || "N/A";
  const firstName = user?.FirstName || "N/A";
  const lastName = user?.LastName || "N/A";

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

  //===============================ดึงวันทั้งหมด========================================
  //const [Days, setDay] = useState<DayInterface[]>([]);
  // const fetchDayAll = async () => {
  //   try {
  //     const res = await GetDay();
  //     if (res.status === 200 && res.data) {
  //       setDay(res.data);
  //     }
  //   } catch (error) {
  //     setDay([]);
  //   }
  // };
  // useEffect(() => {
  //   fetchDayAll();
  // }, []);

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

  // ฟังก์ชันค้นหาอาจารย์ (เรียก API)
  const handleSearchProfessorInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = e.target.value;
    setSearchProfessor(query); // บันทึกคำค้นหาใน state

    if (query.trim() === "") {
      setProfessors([]);
      setDropdownVisible(false);
      return;
    }

    setLoading(true);
    try {
      const response = await SearchProfessors(query); // เรียก API
      console.log("API Response:", response); // Debug ข้อมูลที่ได้จาก API
      if (response && response.length > 0) {
        setProfessors(response); // บันทึกผลการค้นหาใน state
        setDropdownVisible(true); // แสดง Dropdown
      } else {
        setProfessors([]);
        setDropdownVisible(false); // ซ่อน Dropdown ถ้าไม่มีผลลัพธ์
      }
    } catch (error) {
      console.error("Error fetching professors:", error);
      setProfessors([]);
      setDropdownVisible(false);
    } finally {
      setLoading(false); // ปิดสถานะการโหลด
    }
  };

  // ฟังก์ชันเมื่อผู้ใช้คลิกชื่ออาจารย์ใน Dropdown
  const handleProfessorClick = (professor: UserInterface) => {
    setSearchProfessor(`${professor.FirstName} ${professor.LastName}`); // ใส่ชื่ออาจารย์ในช่องค้นหา
    setProfessors([]); // ล้างผลลัพธ์
    setDropdownVisible(false); // ซ่อน Dropdown
  };

  // ดึงข้อมูล Professors ตาม Major ที่เลือก
  const test = async (value: string) => {
    try {
      // อัปเดต selectedMajor
      setSelectedMajor(value);

      // ตรวจสอบว่ามี selectedDepartment หรือไม่ก่อนเรียก API
      if (!selectedDepartment) {
        console.error("Selected department is missing.");
        return;
      }

      // เรียก API เพื่อดึงข้อมูล Professors
      const response = await ListUsersFilters(
        String(selectedDepartment), // Department ID
        String(value), // Major ID ที่เลือก
        String(2) // RoleID: 2 (สำหรับอาจารย์)
      );

      // ตรวจสอบสถานะของ Response
      if (response.status === 200) {
        setProfessors(response.data); // ตั้งค่าข้อมูล Professors
        console.log("Professors fetched successfully:", response.data);
      } else {
        console.error("Failed to fetch professors:", response);
        setProfessors([]); // หากล้มเหลว ให้ตั้งค่าเป็นอาร์เรย์ว่าง
      }
    } catch (error) {
      console.error("Error fetching professors:", error);
      setProfessors([]); // ล้างค่าหากเกิดข้อผิดพลาด
    }
  };

  // ดึงข้อมูล Appointment ตาม UserID
  const fetchAppointments = async (teacherId: string) => {
    try {
      const response = await GetTeacherAppointments(teacherId);
      if (response.status === 200) {
        setAppointments(response.data); // เก็บข้อมูล Appointment
        console.log("Appointments fetched successfully:", response.data);
      } else {
        throw new Error("Failed to fetch appointments");
      }
    } catch (error) {
      message.error("Failed to load appointments.");
      console.error(error);
    }
  };

  // ใช้งาน useEffect เพื่อโหลดข้อมูล Professors เมื่อเลือก Major
  useEffect(() => {
    if (selectedMajor) {
      test(selectedMajor); // เรียกใช้ฟังก์ชัน test เพื่อตรวจสอบ Professors
    }
  }, [selectedMajor]);

  //=============================================popup booking==============================================
  const [ispopup, setPopup] = useState(false);
  const [DataForBooking, setDataForBooking] = useState({
    TName: "",
    title: "",
    location: "",
    description: "",
    userid: 0,
    TappointmentID: 0,
    dayID: 0,
    dayname: "",
  });
  const OpenPopup = (data: TeacherAppointmentInterface) => {
    setPopup(true);
    setDataForBooking({
      TName: String(data.User?.Username),
      title: String(data.title),
      location: String(data.location),
      description: String(data.description),
      userid: Number(userIdstr),
      TappointmentID: Number(data.ID),
      dayID: Number(data.DayofWeekID),
      dayname: String(data.DayofWeek?.DayName),
    });
  };
  //=============================================ภ้ากดจอง=====================================CreateStudentBooking
  const createBooking = async (_formData: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    const value: StudentBookingInterface = {
      UserID: DataForBooking.userid,
      TeacherAppointmentID: DataForBooking.TappointmentID,
      DayofWeekID: DataForBooking.dayID,
    };
    try {
      const res = await CreateStudentBooking(value);
      if (res.status === 201) {
        // await fetchData(String(1));
        message.success("Appointment booked successfully!");
        setPopup(false);
        setDataForBooking({
          TName: "",
          title: "",
          location: "",
          description: "",
          userid: 0,
          TappointmentID: 0,
          dayID: 0,
          dayname: "",
        });
      }
    } catch (error) {
      console.error("Error :", error);
    }
  };

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

        {/* ช่องค้นหา */}
        <div className="student-booking__search">
          {/* Input Search Bar */}
          <div className="search-bar-container">
            <Input
              placeholder="Search Professor by Name"
              value={searchProfessor}
              onChange={handleSearchProfessorInputChange} // ฟังก์ชันที่อัปเดต State
              className="student-booking__search-input"
            />
            <button
              className="search-buttonstdbooking"
              onClick={() => {
                if (searchProfessor.trim() !== "") {
                  handleSearchProfessorInputChange({
                    target: { value: searchProfessor },
                  });
                }
              }}
            >
              🔍
            </button>
          </div>

          {/* Dropdown สำหรับผลลัพธ์ */}
          {isDropdownVisible &&
            searchProfessor.trim() !== "" &&
            professors.length > 0 && (
              <div className="search-dropdown">
                {professors.map((professor) => (
                  <div
                    key={professor.ID}
                    className="search-dropdown-item"
                    onClick={() => handleProfessorClick(professor)}
                  >
                    {professor.FirstName} {professor.LastName}
                  </div>
                ))}
              </div>
            )}

          {/* Loading Indicator */}
          {loading && <div className="loading-indicator">Loading...</div>}
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
            onChange={(value) => {
              setSelectedMajor(value);
              if (selectedDepartment) test(value); // เรียก test เมื่อเลือก Major
            }}
            className="student-booking__select"
            disabled={!selectedDepartment} // หากยังไม่เลือก Department ให้ปิดการทำงาน
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
            value={selectedProfessor}
            onChange={(value) => {
              setSelectedProfessor(value);
              fetchAppointments(value); // ดึงข้อมูล Appointment ตามอาจารย์ที่เลือก
            }}
            className="student-booking__select"
            disabled={!professors.length} // หากไม่มี Professor ให้ Disabled
          >
            {professors.map((professor) => (
              <Option key={professor.ID} value={professor.ID}>
                {professor.FirstName} {professor.LastName}
              </Option>
            ))}
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
        {/* Time Slots =============================================================================================================================*/}
        <div className="Daycontanner">
          <div className="AppointmentContent">
            {appointments.length > 0 ? (
              appointments.map((data, index) => (
                <div
                  style={{ margin: "20px 20px" }}
                  className="cardAppop"
                  key={index}
                >
                  <div>
                    โดย : {data.User?.FirstName} {data.User?.LastName} <br />
                    Title : {data.title} location : {data.location}
                    <br />
                    duration : {data.appointment_duration} <br />
                    description : {data.description} <br />
                    ว่างวัน : {data.DayofWeek?.DayName || "NO DATA"}
                  </div>
                  <div
                    onClick={() => OpenPopup(data)}
                    style={{ cursor: "pointer", margin: "50px 10px" }}
                  >
                    จองนัดหมาย
                  </div>
                </div>
              ))
            ) : (
              <h1 style={{ textAlign: "center", margin: "20% 0px" }}>
                Please select Professor before make an appointment.
              </h1>
            )}
          </div>
        </div>

        {ispopup && (
          <div className="PopupBooking">
            <div className="PopupBooking__header">
              <h3>ต้องการจอง</h3>
              <div
                onClick={() => setPopup(false)}
                className="PopupBooking__close"
              >
                ✕
              </div>
            </div>
            <div className="PopupBooking__content">
              <p>
                <strong>ชื่อครู :</strong> {DataForBooking.TName}
              </p>
              <p>
                <strong>หัวข้อ :</strong> {DataForBooking.title}
              </p>
              <p>
                <strong>คำอธิบาย :</strong> {DataForBooking.description}
              </p>
              <p>
                <strong>สถานที่ :</strong> {DataForBooking.location}
              </p>
              <p>
                <strong>วันที่ :</strong> {DataForBooking.dayname}
              </p>
            </div>
            <div className="PopupBooking__footer">
              <button
                onClick={() =>
                  createBooking({
                    firstName: firstName,
                    lastName: lastName,
                    email: "",
                  })
                }
                className="PopupBooking__btn--confirm"
              >
                ต้องการจอง
              </button>
              <button
                onClick={() => setPopup(false)}
                className="PopupBooking__btn--cancel"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentBooking;
