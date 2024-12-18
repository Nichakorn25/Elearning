import React, { useState } from "react";
import "./StudentBooking.css";

const StudentBooking: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const timeSlots = ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmBooking = () => {
    if (selectedTime) {
      alert(`Your appointment for ${selectedTime} has been booked!`);
    } else {
      alert("Please select a time slot before confirming.");
    }
  };

  return (
    <div className="booking-container">
      <h2 className="booking-title">Mentor Slot</h2>
      <p className="booking-subtitle">60 min appointments</p>
      <div className="time-slots">
        {timeSlots.map((time) => (
          <button
            key={time}
            className={`time-slot ${selectedTime === time ? "selected" : ""}`}
            onClick={() => handleTimeClick(time)}
          >
            {time}
          </button>
        ))}
      </div>
      <button className="confirm-button" onClick={handleConfirmBooking}>
        Confirm Booking
      </button>
    </div>
  );
};

export default StudentBooking;
