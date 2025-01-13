// CreateAppointment.jsx
import React, { useEffect, useState } from "react";
import {
  Input,
  Select,
  Button,
  message,
} from "antd";
// import dayjs from "dayjs";
import TextArea from "antd/lib/input/TextArea";
import "./CreateAppointment.css";
import {
  GetDay,
  SaveAppointment,
} from "../../../../services/https/index";
import {
  DayInterface,
  TeacherAppointmentInterface,
} from "../../../../Interface/IAppointment";

const { Option } = Select;
// const { RangePicker } = TimePicker;

const CreateAppointment: React.FC = () => {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(1);
  const [SelectDay, setSelectDay] = useState(0);
  const [daysAvailability] = useState([
    { day: "Sunday", start: null, end: null, unavailable: true },
    { day: "Monday", start: "09:00", end: "17:00", unavailable: false },
    { day: "Tuesday", start: "09:00", end: "17:00", unavailable: false },
    { day: "Wednesday", start: "09:00", end: "17:00", unavailable: false },
    { day: "Thursday", start: "09:00", end: "17:00", unavailable: false },
    { day: "Friday", start: "09:00", end: "17:00", unavailable: false },
    { day: "Saturday", start: null, end: null, unavailable: true },
  ]);
  const [bufferTime] = useState(30);
  const [maxBookings] = useState(4);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const userId = localStorage.getItem("id");

  //===============================ดึงวันทั้งหมด========================================
  const [Days, setDay] = useState<DayInterface[]>([]);
  const fetchDayAll = async () => {
    try {
      const res = await GetDay();
      if (res.status === 200 && res.data) {
        setDay(res.data);
      }
    } catch (error) {
      setDay([]);
    }
  };
  useEffect(() => {
    fetchDayAll();
  }, []);
  //=============================== selector day ===================================
  //selector
  const selectDay = (value: string) => {
    setSelectDay(Number(value));
    console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
  };
  //================================================================================

  const handleSave = async () => {
    if (!userId) {
      message.error("UserID ไม่พบ กรุณาเข้าสู่ระบบอีกครั้ง");
      return;
    }

    if (!title || !duration || daysAvailability.length === 0) {
      message.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    const values: TeacherAppointmentInterface = {
      title: title,
      appointment_duration: duration,
      // buffer_time: bufferTime,
      // max_bookings: maxBookings,
      location: location,
      description: description,
      UserID: Number(userId),
      availability_id: 0,
      isBooked: undefined,
      time: null,
      date: null,
      appointmentId: 0,
      DayofWeekID: SelectDay,
    };
    console.log(userId);
    console.log(title);
    console.log(duration);
    console.log(bufferTime);
    console.log(maxBookings);
    console.log(location);
    console.log(description);
    console.log(SelectDay);
    try {
      const appointmentResponse = await SaveAppointment(values);
      if (appointmentResponse.status === 201) {
        message.success("Appointment created successfully!");
      } else {
        message.error("Failed to create appointment.");
      }
    } catch (error) {
      console.error("Error saving appointment:", error);
      message.error("Failed to create appointment. Please try again.");
    }
  };

  // const handleDayChange = (index: number, unavailable: boolean) => {
  //   const updatedDays = [...daysAvailability];
  //   updatedDays[index].unavailable = unavailable;
  //   if (unavailable) {
  //     updatedDays[index].start = null;
  //     updatedDays[index].end = null;
  //   }
  //   setDaysAvailability(updatedDays);
  // };

  // const handleTimeChange = (index: number, times: any) => {
  //   const updatedDays = [...daysAvailability];
  //   updatedDays[index].start = times ? times[0].format("HH:mm") : null;
  //   updatedDays[index].end = times ? times[1].format("HH:mm") : null;
  //   setDaysAvailability(updatedDays);
  // };

  return (
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
          placeholder="Select Duration"
          onChange={(value) => setDuration(value)} // กำหนดค่า duration เมื่อเลือก
        >
          {/* ตัวเลือกสำหรับช่วงเวลา */}
          <Option value="9.00-10.00">9.00-10.00</Option>
          <Option value="11.00-12.00">11.00-12.00</Option>
          <Option value="13.00-14.00">13.00-14.00</Option>
          <Option value="15.00-16.00">15.00-16.00</Option>

        </Select>
      </div>

      <div className="create-appointment-section">
        <label className="create-appointment-section-label">Select Day</label>
        <Select
          style={{ width: "60%" }}
          showSearch
          placeholder="Select a Day"
          optionFilterProp="label"
          onChange={selectDay}
          onSearch={onSearch}
          options={Days.map((Day) => ({
            value: Day.ID,
            label: Day.DayName,
          }))}
        />
      </div>

      {/* Buffer Time */}
      {/* <div className="create-appointment-section">
        <label className="create-appointment-section-label">Buffer Time</label>
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
      </div> */}

      {/* Maximum Bookings */}
      {/* <div className="create-appointment-section">
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
      </div> */}

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
        <label className="create-appointment-section-label">Description</label>
        <TextArea
          placeholder="Add description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      <div className="create-appointment-footer">
        <Button className="create-appointment-cancel-button">Cancel</Button>
        <Button className="create-appointment-save-button" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default CreateAppointment;
