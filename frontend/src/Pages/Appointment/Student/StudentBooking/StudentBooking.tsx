import React, { useState } from "react";
import { Input, Button } from "antd";
import "./StudentBooking.css";

const StudentBookingPopup = ({ isVisible, onClose, onSubmit }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");

  const handleBooking = () => {
    // Call onSubmit with the input data
    onSubmit({
      firstName,
      lastName,
      email,
      studentId,
    });
    onClose(); // Close the modal
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="student-booking-popup">
      <div className="popup-content">
        <h3 className="popup-title">Mentor Slot</h3>
        <p>Wednesday, July 19, 09:00 - 09:30</p>
        <p>(GMT+07:00) Indochina Time - Bangkok</p>
        <p className="info-note">
          Google Meet video conference info added after booking
        </p>

        <div className="form-group">
          <Input
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={{ marginBottom: "16px" }}
          />
          <Input
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={{ marginBottom: "16px" }}
          />
          <Input
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: "16px" }}
          />
          <Input
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            style={{ marginBottom: "16px" }}
          />
        </div>

        <div className="form-actions">
          <Button type="default" onClick={onClose} style={{ marginRight: "8px" }}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleBooking}>
            Book
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentBookingPopup;
