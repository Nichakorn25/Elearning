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
import { GetTeacherAppointments } from "../../../../services/https";
import {
  StudentBookingInterface,
  TeacherAppointmentInterface,
} from "../../../../Interface/IAppointment";
import Swal from "sweetalert2";

const { Option } = Select;
const StudentBooking: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null);
  const [searchProfessor, setSearchProfessor] = useState<string>(""); // ใช้ searchProfessor แทน
  const [departments, setDepartments] = useState<any[]>([]);
  const [majors, setMajors] = useState<any[]>([]);
  const [professors, setProfessors] = useState<UserInterface[]>([]);
  const [appointments, setAppointments] = useState<
    TeacherAppointmentInterface[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false); // ควบคุมการแสดงผล Dropdown
  const [selectedProfessor, setSelectedProfessor] = useState<string | null>(
    null
  );
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userIdstr = localStorage.getItem("id");
  const firstName = user?.FirstName || "N/A";
  const lastName = user?.LastName || "N/A";

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

  // ฟังก์ชันค้นหาอาจารย์ (เรียก API)
  const handleSearchProfessorInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { value: string } }
  ) => {
    const query = "target" in e ? e.target.value : ""; // ตรวจสอบชนิดข้อมูล
    setSearchProfessor(query);

    if (query.trim() === "") {
      setProfessors([]);
      setDropdownVisible(false);
      return;
    }

    setLoading(true);
    SearchProfessors(query)
      .then((response) => {
        if (response && response.length > 0) {
          setProfessors(response);
          setDropdownVisible(true);
        } else {
          setProfessors([]);
          setDropdownVisible(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching professors:", error);
        setProfessors([]);
        setDropdownVisible(false);
      })
      .finally(() => setLoading(false));
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
  //=============================================ถ้ากดจอง=====================================CreateStudentBooking
const createBooking = async () => {
  setPopup(false); // ปิด Popup ก่อน
  setLoading(true); // เริ่มแสดงหน้าโหลด

  try {
    const value: StudentBookingInterface = {
      UserID: DataForBooking.userid,
      TeacherAppointmentID: DataForBooking.TappointmentID,
      DayofWeekID: DataForBooking.dayID,
    };

    const res = await CreateStudentBooking(value);

    // ใช้ setTimeout เพื่อแสดงหน้าโหลดขั้นต่ำ 2 วินาที
    setTimeout(() => {
      if (res.status === 201) {
        Swal.fire({
          title: "Success!",
          text: `การจอง "${DataForBooking.title}" สำเร็จแล้ว`,
          icon: "success",
          confirmButtonText: "OK",
        });

        // อัปเดต appointments เพื่อกรองข้อมูลที่จองออก
        setAppointments((prevAppointments) =>
          prevAppointments.filter(
            (appointment) => appointment.ID !== DataForBooking.TappointmentID
          )
        );

        // รีเซ็ตข้อมูลหลังการจองสำเร็จ
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
      } else {
        Swal.fire({
          title: "Error!",
          text: "ไม่สามารถจองนัดหมายได้ โปรดลองอีกครั้ง",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
      setLoading(false); // ปิดหน้าโหลดหลังจาก 2 วินาที
    }, 2000);
  } catch (error) {
    // ใช้ setTimeout เพื่อเลื่อนเวลาโหลดเมื่อเกิดข้อผิดพลาด
    setTimeout(() => {
      console.error("Error during booking:", error);
      Swal.fire({
        title: "Error!",
        text: "เกิดข้อผิดพลาดในการจอง โปรดลองอีกครั้ง",
        icon: "error",
        confirmButtonText: "OK",
      });
      setLoading(false); // ปิดหน้าโหลด
    }, 2000);
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
                    Title : {data.title} <br />
                    location : {data.location}<br />
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
                onClick={() => !loading && setPopup(false)} // ปิด Popup เฉพาะเมื่อไม่โหลด
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
                onClick={createBooking} // ใช้ฟังก์ชัน createBooking
                className="PopupBooking__btn--confirm"
                disabled={loading} // ปิดการใช้งานปุ่มขณะโหลด
              >
                {loading ? "Loading..." : "ต้องการจอง"}
              </button>
              <button
                onClick={() => !loading && setPopup(false)} // ปิด Popup เฉพาะเมื่อไม่โหลด
                className="PopupBooking__btn--cancel"
                disabled={loading} // ปิดการใช้งานปุ่มขณะโหลด
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
