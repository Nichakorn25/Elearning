import React, { useState } from "react";
import { Modal, Input, Select, TimePicker, Checkbox, Button } from "antd";
import dayjs from "dayjs";
import TextArea from "antd/lib/input/TextArea";
import "./CreateAppointment.css";

const { Option } = Select;
const { RangePicker } = TimePicker;

const CreateAppointment = ({ isVisible, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("1 hour");
  const [daysAvailability, setDaysAvailability] = useState([
    { day: "Sunday", start: null, end: null, unavailable: true },
    { day: "Monday", start: "09:00", end: "17:00", unavailable: false },
    { day: "Tuesday", start: "09:00", end: "17:00", unavailable: false },
    { day: "Wednesday", start: "09:00", end: "17:00", unavailable: false },
    { day: "Thursday", start: "09:00", end: "17:00", unavailable: false },
    { day: "Friday", start: "09:00", end: "17:00", unavailable: false },
    { day: "Saturday", start: null, end: null, unavailable: true },
  ]);
  const [bufferTime, setBufferTime] = useState(30);
  const [maxBookings, setMaxBookings] = useState(4);

  const handleSave = () => {
    onSubmit({
      title,
      location,
      description,
      bookingFormFields,
    });
    onClose(); // ปิด Modal หลังจากบันทึก
  };

  const handleDayChange = (index, unavailable) => {
    const updatedDays = [...daysAvailability];
    updatedDays[index].unavailable = unavailable;
    if (unavailable) {
      updatedDays[index].start = null;
      updatedDays[index].end = null;
    }
    setDaysAvailability(updatedDays);
  };

  const handleTimeChange = (index, times) => {
    const updatedDays = [...daysAvailability];
    updatedDays[index].start = times ? times[0].format("HH:mm") : null;
    updatedDays[index].end = times ? times[1].format("HH:mm") : null;
    setDaysAvailability(updatedDays);
  };

  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [bookingFormFields, setBookingFormFields] = useState({
    firstName: true,
    lastName: true,
    email: true,
  });


  return (
    <Modal
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      className="custom-appointment-modal"
    >
      <h2>Bookable Appointment Schedule</h2>

      {/* Title */}
      <Input
        placeholder="Add title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: "16px" }}
      />

      {/* Appointment Duration */}
      <div style={{ marginBottom: "16px" }}>
        <label>Appointment Duration:</label>
        <Select
          value={duration}
          style={{ width: "100%" }}
          onChange={(value) => setDuration(value)}
        >
          <Option value="1 hour">1 hour</Option>
          <Option value="30 minutes">30 minutes</Option>
        </Select>
      </div>

      {/* General Availability */}
      <div style={{ marginBottom: "16px" }}>
        <h3>General Availability:</h3>
        {daysAvailability.map((day, index) => (
          <div key={index} className="availability-row">
            <span style={{ width: "100px", display: "inline-block" }}>
              {day.day}:
            </span>
            <Checkbox
              checked={!day.unavailable}
              onChange={(e) => handleDayChange(index, !e.target.checked)}
            >
              {day.unavailable ? "Unavailable" : "Available"}
            </Checkbox>
            {!day.unavailable && (
              <RangePicker
                format="HH:mm"
                value={
                  day.start && day.end
                    ? [dayjs(day.start, "HH:mm"), dayjs(day.end, "HH:mm")]
                    : null
                }
                onChange={(times) => handleTimeChange(index, times)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Buffer Time and Maximum Bookings */}
      <div style={{ marginBottom: "16px" }}>
        <h3>Booked Appointment Settings:</h3>
        <Checkbox
          checked={bufferTime > 0}
          onChange={(e) => setBufferTime(e.target.checked ? 30 : 0)}
        >
          Buffer Time
        </Checkbox>
        {bufferTime > 0 && (
          <Input
            type="number"
            min={0}
            value={bufferTime}
            onChange={(e) => setBufferTime(Number(e.target.value))}
            addonAfter="minutes"
            style={{ width: "150px", marginLeft: "16px" }}
          />
        )}
        <div style={{ marginTop: "16px" }}>
          <Checkbox
            checked={maxBookings > 0}
            onChange={(e) => setMaxBookings(e.target.checked ? 4 : 0)}
          >
            Maximum Bookings Per Day
          </Checkbox>
          {maxBookings > 0 && (
            <Input
              type="number"
              min={1}
              value={maxBookings}
              onChange={(e) => setMaxBookings(Number(e.target.value))}
              style={{ width: "150px", marginLeft: "16px" }}
            />
          )}
        </div>
      </div>

      {/* Location */}
      <div style={{ marginBottom: "16px" }}>
        <label>Location and Conferencing:</label>
        <Select
          placeholder="Select how and where to meet"
          value={location}
          style={{ width: "100%" }}
          onChange={(value) => setLocation(value)}
        >
          <Option value="inPerson">Onsite</Option>
          <Option value="videoCall">Online</Option>
        </Select>
      </div>

      {/* Description */}
      <div style={{ marginBottom: "16px" }}>
        <label>Description:</label>
        <TextArea
          placeholder="Add description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      {/* Booking Form */}
      <div style={{ marginBottom: "16px" }}>
        <h3>Booking Form</h3>
        <Checkbox
          checked={bookingFormFields.firstName}
          onChange={(e) =>
            setBookingFormFields((prev) => ({
              ...prev,
              firstName: e.target.checked,
            }))
          }
        >
          First Name
        </Checkbox>
        <Checkbox
          checked={bookingFormFields.lastName}
          onChange={(e) =>
            setBookingFormFields((prev) => ({
              ...prev,
              lastName: e.target.checked,
            }))
          }
        >
          Last Name
        </Checkbox>
        <Checkbox
          checked={bookingFormFields.email}
          onChange={(e) =>
            setBookingFormFields((prev) => ({
              ...prev,
              email: e.target.checked,
            }))
          }
        >
          Email Address
        </Checkbox>
      </div>

      {/* Save Button */}
      <div style={{ textAlign: "right" }}>
        <Button onClick={onClose} style={{ marginRight: "8px" }}>
          Cancel
        </Button>
        <Button onClick={handleSave} type="primary">
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default CreateAppointment;
