import React, { useState } from "react";
import "./StudentBooking.css";
import Header from "../../../Component/Header/Header";

const StudentBooking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

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
      <Header/>
      <header className="student-booking__header">
        {/* ส่วนแสดงชื่อ Username */}
        <div className="student-booking__user-info">
          <span className="student-booking__user-avatar">N</span>
          <span className="student-booking__user-name">{username}</span>
        </div>
        <h1 className="student-booking__title">test</h1>
        <p className="student-booking__subtitle">60 min appointments</p>
        <p className="student-booking__timezone">(GMT+07:00) Indochina Time - Bangkok</p>
      </header>
      <main className="student-booking__main">
        <section className="student-booking__calendar-section">
          <h2 className="student-booking__calendar-title">December 2024</h2>
          <div className="student-booking__calendar-grid">
            {dates.map((date) => (
              <button
                key={date}
                className={`student-booking__calendar-date ${
                  selectedDate === date ? "student-booking__calendar-date--selected" : ""
                }`}
                onClick={() => handleDateClick(date)}
              >
                {date}
              </button>
            ))}
          </div>
        </section>
        <section className="student-booking__timeslots-section">
          <div className="student-booking__timeslots-grid">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                className={`student-booking__timeslot ${
                  selectedTime === slot ? "student-booking__timeslot--selected" : ""
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
