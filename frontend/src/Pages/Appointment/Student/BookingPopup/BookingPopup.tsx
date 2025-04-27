import React, { useEffect } from "react";
import { Modal, Input, Button } from "antd";
import "./BookingPopup.css"; // นำเข้า CSS

interface BookingPopupProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (formData: { firstName: string; lastName: string; email: string }) => void;
  selectedDate: string;
  selectedTime: string;
}

const BookingPopup: React.FC<BookingPopupProps> = ({
  visible,
  onClose,
  onSubmit,
  selectedDate,
  selectedTime,
}) => {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");

  // ดึงข้อมูลผู้ใช้จาก localStorage เมื่อ Popup เปิด
  useEffect(() => {
    if (visible) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setFirstName(user?.FirstName || "");
      setLastName(user?.LastName || "");
      setEmail(user?.Email || "");
    }
  }, [visible]);

  const handleSubmit = () => {
    if (firstName && lastName && email) {
      onSubmit({ firstName, lastName, email });
      onClose();
    } else {
      alert("Please fill all fields.");
    }
  };

  return (
    <Modal
      visible={visible}
      title={<div className="booking-popup-header">Your contact info</div>}
      onCancel={onClose}
      footer={null}
      className="booking-popup-modal"
      maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
      modalRender={(node) => <div>{node}</div>}
    >
      <div className="booking-popup-info">
        <p>
          <b>Date:</b> {selectedDate} <br />
          <b>Time:</b> {selectedTime}
        </p>
      </div>
      <Input
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="booking-popup-input"
      />
      <Input
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="booking-popup-input"
      />
      <Input
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="booking-popup-input"
      />
      <div className="booking-popup-actions">
        <Button
          className="booking-popup-button booking-popup-button-cancel"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          className="booking-popup-button booking-popup-button-primary"
          onClick={handleSubmit}
        >
          Book
        </Button>
      </div>
    </Modal>
  );
};

export default BookingPopup;