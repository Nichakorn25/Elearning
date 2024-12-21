import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select, TimePicker, Checkbox, Button, Collapse } from "antd";
import dayjs from "dayjs";
import TextArea from "antd/lib/input/TextArea";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./CreateAppointment.css";
import Header from "../../../Component/Header/Header";

const { Option } = Select;
const { RangePicker } = TimePicker;
const { Panel } = Collapse;

const CreateAppointment: React.FC = () => {
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับปิดฟอร์มและกลับไปที่หน้า TeacherCalendar
  const handleClose = () => {
    navigate("/TeacherCalendar"); // กลับไปหน้า TeacherCalendar
  };

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
  const [bookingFormFields, setBookingFormFields] = useState({
    firstName: true,
    lastName: true,
    email: true,
  });

  const [events, setEvents] = useState([]);
  const handleEventAdd = (info: any) => {
    const newEvent = {
      title: title || "New Appointment",
      start: info.startStr,
      end: info.endStr,
    };
    setEvents([...events, newEvent]);
  };

  const handleSave = () => {
    console.log("Saved Data:", {
      title,
      duration,
      daysAvailability,
      bufferTime,
      maxBookings,
      location,
      description,
      bookingFormFields,
    });
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
    <div className="fullscreen-container">
      <Header />
      {/* Left Panel */}
      <div className="left-panel">
      <button className="close-button" onClick={handleClose}>
          X
        </button>
        <h2>Bookable Appointment Schedule</h2>
     
        <Collapse defaultActiveKey={["1"]} className="createappointmentcontent">
          {/* Title Section */}
          <Panel header="Title & Duration" key="1">
            <Input
              placeholder="Add title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ marginBottom: "16px" }}
            />
            <Select
              value={duration}
              style={{ width: "100%", marginBottom: "16px" }}
              onChange={(value) => setDuration(value)}
            >
              <Option value="15 minutes">15 minutes</Option>
              <Option value="30 minutes">30 minutes</Option>
              <Option value="1 hour">1 hour</Option>
              <Option value="2 hours">2 hours</Option>
            </Select>
          </Panel>

          {/* General Availability Section */}
          <Panel header="General Availability" key="2">
            {daysAvailability.map((day, index) => (
              <div key={index} className="availability-row">
                <span style={{ width: "100px", display: "inline-block" }}>
                  {day.day}:
                </span>
                <Checkbox
                  checked={!day.unavailable}
                  onChange={(e) =>
                    handleDayChange(index, !e.target.checked)
                  }
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
          </Panel>

          {/* Settings Section */}
          <Panel header="Booked Appointment Settings" key="3">
            <div style={{ marginBottom: "16px" }}>
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
            </div>
            <div>
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
          </Panel>

          {/* Location Section */}
          <Panel header="Location & Conferencing" key="4">
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
          </Panel>

          {/* Description Section */}
          <Panel header="Description" key="5">
            <TextArea
              placeholder="Add description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </Panel>

          {/* Booking Form */}
          <Panel header="Booking Form" key="6">
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
          </Panel>
        </Collapse>
        <div style={{ textAlign: "right", marginTop: "16px" }}>
          <Button style={{ marginRight: "8px" }}>Cancel</Button>
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          events={events}
          select={handleEventAdd}
          headerToolbar={{
            start: "title",
            center: "",
            end: "prev,next today",
          }}
        />
      </div>
    </div>
  );
};

export default CreateAppointment;
