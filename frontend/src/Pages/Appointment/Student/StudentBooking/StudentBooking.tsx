import React, { useState, useEffect } from "react";
import "./StudentBooking.css";
import { Select, Input, message } from "antd";
import Header from "../../../Component/Header/Header";
import Calendar from "react-calendar";
import {
  BookAppointment,
  CreateStudentBooking,
  GetDay,
  GetDepartments,
  GetMajors,
  ListUsersFilters,
  SearchProfessors,
} from "../../../../services/https";
import { UserInterface } from "../../../../Interface/IUser";
import BookingPopup from "../BookingPopup/BookingPopup";
import { GetTeacherAppointments } from "../../../../services/https";
import {
  DayInterface,
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

  //===============================ดึงวันทั้งหมด========================================
  const [Days, setDay] = useState<DayInterface[]>([]);
  const fetchDayAll = async () => {
    try {
      const res = await GetDay();
      if (res.status === 200 && res.data) {
        setDay(res.data);
      }
    } catch (error) {
      setDay([]);
    }
  };
  useEffect(() => {
    fetchDayAll();
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
  // const test = async (value: string) => {
  //   setSelectedMajor(value);
  //   try {
  //     const response = await ListUsersFilters(
  //       String(selectedDepartment),
  //       String(selectedMajor),
  //       String(2)
  //     );
  //     if (response.status === 200) {
  //       setProfessors(response.data);
  //       console.log(response.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching professors:", error);
  //     setProfessors([]);
  //   }
  // };

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

  // เมื่อเลือก Professor (เช่น ผ่าน Dropdown)
  // const handleSelectProfessor = (professorId: string) => {
  //   fetchAppointments(professorId); // ดึงข้อมูล Appointment ตาม UserID ของอาจารย์
  // };

  // const timeSlots = [
  //   "9:00am",
  //   "10:00am",
  //   "11:00am",
  //   "12:00pm",
  //   "1:00pm",
  //   "2:00pm",
  //   "3:00pm",
  //   "9:00am",
  // ];

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

  const handleSlotClick = (
    date: number | null,
    time: string | null,
    appointmentId: number
  ) => {
    if (date !== null && time) {
      setPopupData({
        date: date.toString(), // แปลง number เป็น string
        time: time, // ใช้ time โดยตรงหลังจากตรวจสอบว่าไม่เป็น null
        appointmentId,
      });
      setSelectedDate(date); // กำหนดค่า date โดยตรง
      setSelectedTime(time); // กำหนดค่า time โดยตรง
      setIsBookingPopupVisible(true);
    } else {
      console.error("Invalid date or time: null");
    }
  };

  const handlePopupSubmit = async () => {
    if (!popupData || !popupData.appointmentId) {
      message.error("No appointment data available");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.ID) throw new Error("User is not logged in");

      const response = await BookAppointment({
        UserID: user.ID,
        TeacherAppointmentID: popupData.appointmentId,
      });

      if (response.status === 201) {
        message.success("Appointment booked successfully!");
        setAppointments((prev) =>
          prev.filter(
            (appointment) => appointment.ID !== popupData.appointmentId
          )
        );
        setIsBookingPopupVisible(false);
      } else {
        throw new Error("Failed to book appointment");
      }
    } catch (error) {
      message.error("Failed to book appointment.");
      console.error(error);
    }
  };

  const handlePopupClose = () => {
    // ปิด Popup โดยไม่บันทึกข้อมูล
    setIsBookingPopupVisible(false);
  };

  const dates = getDatesForWeek(currentWeek);
  const handlePrevWeek = () => setCurrentWeek((prev) => prev - 1);
  const handleNextWeek = () => setCurrentWeek((prev) => prev + 1);

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
      userid: Number(data.UserID),
      TappointmentID: Number(data.ID),
      dayID: Number(data.DayofWeekID),
      dayname: String(data.DayofWeek?.DayName),
    });
  };
  //=============================================ภ้ากดจอง=====================================CreateStudentBooking
  const createBooking = async (_formData: { firstName: string; lastName: string; email: string; }) => {
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

        <div className="student-booking__search">
          <Input
            placeholder="Search Professor by Name"
            value={searchProfessor}
            onChange={(e) => setSearchProfessor(e.target.value)} // เก็บค่าที่ผู้ใช้พิมพ์
            onPressEnter={handleSearch} // เรียกฟังก์ชันค้นหาเมื่อกด Enter
            className="student-booking__search-input"
          />
          <button onClick={handleSearch} className="search-buttonstdbooking">
            Search
          </button>
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
          {/* <div className="Day">
            
            {Days.map((date, index) => (
              <>
                <div style={{ margin: '0 20px' }} key={index}>{date.DayName}</div>
              </>
            ))}
           
          </div> */}

          <div className="AppointmentContent">
            {appointments.length > 0 ? (
              appointments.map((data, index) => (
                <>
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
                </>
              ))
            ) : (
              <>
                <h1 style={{ textAlign: "center", margin: "20% 0px" }}>
                  Please select Professor before make an appointment.
                </h1>
              </>
            )}
          </div>
        </div>
        {/* booking popup =============================================================================================================================*/}
        {ispopup && (
          <div className="PopupBooking">
            <div style={{ textAlign: "center" }}>ต้องการจอง</div>
            ชื่อครู : {DataForBooking.TName} <br />
            หัวข้อ : {DataForBooking.title} <br />
            คำอธิบาย : {DataForBooking.description} <br />
            สถานที่ : {DataForBooking.location} <br />
            วันที่ : {DataForBooking.dayname} <br />
            {/* Show Booking Popup */}
            <div
              onClick={() => setIsBookingPopupVisible(true)}
              className="BtnBooking"
            >
              ต้องการจอง
            </div>
            {/* Close button */}
            <div
              onClick={() => setPopup(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                width: "20px",
                height: "20px",
                backgroundColor: "#ff8d67",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            ></div>
          </div>
        )}
        {/* /* Booking Popup */ }
        <BookingPopup
          visible={isBookingPopupVisible}
          onClose={() => {
            setIsBookingPopupVisible(false);
            setPopup(false); // Close the main popup
          }}
          onSubmit={(formData) => createBooking(formData)}
          selectedDate={DataForBooking.dayname}
          selectedTime={DataForBooking.title}
        />
      </main>
    </div>
  );
};

export default StudentBooking;
