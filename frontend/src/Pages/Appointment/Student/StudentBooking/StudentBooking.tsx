import React, { useState } from "react";
import "./StudentBooking.css";
import { Select, Input } from "antd";
import Header from "../../../Component/Header/Header";
import Calendar from "react-calendar";

const { Option } = Select;

const StudentBooking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [faculty, setFaculty] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [professor, setProfessor] = useState<string | null>(null);
  const [searchProfessor, setSearchProfessor] = useState<string>("");

  const faculties = ["Engineering", "Science", "Arts"];
  const departments = [
    "Computer Science",
    "Mechanical Engineering",
    "Mathematics",
  ];
  const professors = ["Dr. A", "Dr. B", "Dr. C"];

  const handleFacultyChange = (value: string) => {
    setFaculty(value);
  };

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
  };

  const handleProfessorChange = (value: string) => {
    setProfessor(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchProfessor(e.target.value);
  };

  const dates = Array.from({ length: 31 }, (_, i) => i + 1);
  const timeSlots = [
    "9:00am",
    "10:00am",
    "11:00am",
    "12:00pm",
    "1:00pm",
    "2:00pm",
    "3:00pm",
  ];

  const username = "Nichakorn Chanyutha"; // เปลี่ยนชื่อให้ตรงกับผู้ใช้งานที่ล็อกอิน

  const handleDateClick = (date: number) => {
    setSelectedDate(date);
  };

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      alert(`Appointment booked on ${selectedDate} at ${selectedTime}`);
    } else {
      alert("Please select a date and time.");
    }
  };

  return (
    <div className="student-booking__container">
      <Header />
      <header className="student-booking__header">
        {/* ส่วนแสดงชื่อ Username */}
        <div className="student-booking__user-info">
          <span className="student-booking__user-avatar">N</span>
          <div className="student-booking__user-details">
            <span className="student-booking__user-name">Nichakorn</span>
            <span className="student-booking__user-surname">Chanyutha</span>
          </div>
          {/* ส่วน Title */}
          <div className="student-booking__title">
            <h1>test</h1>
            <p className="student-booking__subtitle">
              <span className="student-booking__icon">⏰</span> 60 min
              appointments
            </p>
          </div>
        </div>

        <div className="student-booking__search">
          {/* Search Bar */}
          <div className="student-booking__search">
            <Input
              placeholder="Search Professor by Name"
              value={searchProfessor}
              onChange={handleSearchChange}
              className="student-booking__search-input"
            />
          </div>
        </div>
        {/* Dropdowns */}
        <div className="student-booking__dropdowns">
          <Select
            placeholder="Select Faculty"
            value={faculty}
            onChange={handleFacultyChange}
            className="student-booking__select"
          >
            {faculties.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Select Department"
            value={department}
            onChange={handleDepartmentChange}
            className="student-booking__select"
          >
            {departments.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Select Professor"
            value={professor}
            onChange={handleProfessorChange}
            className="student-booking__select"
          >
            {professors.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </div>
      </header>
      <main className="student-booking__main">
        {/* Mini Calendar */}
        <section className="student-booking__mini-calendar">
          <div className="mini-calendar-container">
            <Calendar
              onChange={(date: Date) => setSelectedDate(date.getDate())}
              value={new Date()}
            />
          </div>
        </section>

        {/* Time Slots */}
        <section className="student-booking__timeslots-section">
          <h2 className="student-booking__timeslots-title">Available Slots</h2>
          <div className="student-booking__timeslots-grid">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                className={`student-booking__timeslot ${
                  selectedTime === slot
                    ? "student-booking__timeslot--selected"
                    : ""
                }`}
                onClick={() => handleTimeClick(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className="student-booking__footer">
        <button
          className="student-booking__confirm-btn"
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedTime}
        >
          Confirm Appointment
        </button>
      </footer>
    </div>
  );
};

export default StudentBooking;
