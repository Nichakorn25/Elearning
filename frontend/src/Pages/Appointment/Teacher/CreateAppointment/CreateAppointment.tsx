import React, { useState } from "react";
import { Modal, Input, Select, TimePicker, Checkbox, Button } from "antd";
import dayjs from "dayjs";
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
    // ส่งข้อมูลเมื่อกด Save
    onSubmit({
      title,
      duration,
      daysAvailability,
      bufferTime,
      maxBookings,
    });
    onClose(); // ปิด Modal
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
