// CreateAppointment.jsx
import React, { useState } from "react";
import { Modal, Input, Select, TimePicker, Checkbox, Button } from "antd";
import dayjs from "dayjs";
import TextArea from "antd/lib/input/TextArea";
import "./CreateAppointment.css";

const { Option } = Select;
const { RangePicker } = TimePicker;

interface CreateAppointmentProps {
  isVisible: boolean;
  onClose: () => void;
}

const CreateAppointment: React.FC<CreateAppointmentProps> = ({
  isVisible,
  onClose,
}) => {
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
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    console.log("Saved Data:", {
      title,
      duration,
      daysAvailability,
      bufferTime,
      maxBookings,
      location,
      description,
    });
    onClose(); // ปิด Popup หลังบันทึก
  };

  const handleDayChange = (index: number, unavailable: boolean) => {
    const updatedDays = [...daysAvailability];
    updatedDays[index].unavailable = unavailable;
    if (unavailable) {
      updatedDays[index].start = null;
      updatedDays[index].end = null;
    }
    setDaysAvailability(updatedDays);
  };

  const handleTimeChange = (index: number, times: any) => {
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
      title="Bookable Appointment Schedule"
      className="create-appointment-modal-content"
      width={600} // ลดขนาดของ Popup
    >
      <div>
        {/* Title */}
        <div className="create-appointment-section">
          <label className="create-appointment-section-label">Add Title</label>
          <Input
            placeholder="Add title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="create-appointment-section">
          <label className="create-appointment-section-label">
            Appointment Duration
          </label>
          <Select
            value={duration}
            style={{ width: "100%" }}
            onChange={(value) => setDuration(value)}
          >
            <Option value="15 minutes">15 minutes</Option>
            <Option value="30 minutes">30 minutes</Option>
            <Option value="1 hour">1 hour</Option>
            <Option value="2 hours">2 hours</Option>
          </Select>
        </div>

        <div className="create-appointment-section">
          <label className="create-appointment-section-label">
            General Availability
          </label>
          {daysAvailability.map((day, index) => (
            <div key={index} className="create-appointment-availability-row">
              <span className="create-appointment-day">{day.day}:</span>
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

        {/* Buffer Time */}
        <div className="create-appointment-section">
          <label className="create-appointment-section-label">
            Buffer Time
          </label>
          <Checkbox
            checked={bufferTime > 0}
            onChange={(e) => setBufferTime(e.target.checked ? 30 : 0)}
          >
            Add Buffer Time
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
        </div>

        {/* Maximum Bookings */}
        <div className="create-appointment-section">
          <label className="create-appointment-section-label">
            Maximum Bookings
          </label>
          <Checkbox
            checked={maxBookings > 0}
            onChange={(e) => setMaxBookings(e.target.checked ? 4 : 0)}
          >
            Limit Bookings
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

        {/* Location */}
        <div className="create-appointment-section">
          <label className="create-appointment-section-label">Location</label>
          <Select
            placeholder="Select how and where to meet"
            value={location}
            style={{ width: "100%" }}
            onChange={(value) => setLocation(value)}
          >
            <Option value="inPerson">In-person meeting</Option>
            <Option value="videoCall">Video conferencing</Option>
            <Option value="phoneCall">Phone call</Option>
          </Select>
        </div>

        {/* Description */}
        <div className="create-appointment-section">
          <label className="create-appointment-section-label">
            Description
          </label>
          <TextArea
            placeholder="Add description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="create-appointment-footer">
          <Button
            className="create-appointment-cancel-button"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="create-appointment-save-button"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateAppointment;
