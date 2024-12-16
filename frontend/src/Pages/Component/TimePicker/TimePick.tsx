import React, { useState } from "react";
import { FormControl, FormLabel, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Dayjs } from "dayjs";
import "./TimePick.css"; 

interface Schedule {
  day: string;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
}

const TimePickerWithAddButton: React.FC = () => {
  const [schedule, setSchedule] = useState<Schedule[]>([
    { day: "", startTime: null, endTime: null },
  ]);

  const handleAddSchedule = () => {
    setSchedule([...schedule, { day: "", startTime: null, endTime: null }]);
  };

  const handleScheduleChange = (index: number, field: keyof Schedule, value: any) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  return (
    <div className="time_pick">
  {schedule.map((item, index) => (
    <div key={index} className="sub_1">
      {/* วันที่ทำการสอน */}
      <FormControl sx={{ m: 1, minWidth: 120 }} required>
        <FormLabel className="custom-form-label">วันที่ทำการสอน</FormLabel>
        <Select
          labelId={`dateOfStudy-${index}`}
          id={`dateOfStudy-${index}`}
          value={item.day}
          onChange={(e) => handleScheduleChange(index, "day", e.target.value)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="1">วันจันทร์</MenuItem>
          <MenuItem value="2">วันอังคาร</MenuItem>
          <MenuItem value="3">วันพุธ</MenuItem>
        </Select>
      </FormControl>

      {/* เวลาเริ่มเรียน */}
      <FormControl sx={{ m: 1, minWidth: 120 }} required>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <FormLabel className="custom-form-label">เวลาเริ่มเรียน</FormLabel>
          <DemoContainer components={["TimePicker"]}>
            <TimePicker
              label="เวลาเริ่มเรียน"
              value={item.startTime}
              onChange={(newValue) =>
                handleScheduleChange(index, "startTime", newValue)
              }
            />
          </DemoContainer>
        </LocalizationProvider>
      </FormControl>

      {/* เวลาเลิกเรียน */}
      <FormControl sx={{ m: 1, minWidth: 120 }} required>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <FormLabel className="custom-form-label">เวลาเลิกเรียน</FormLabel>
          <DemoContainer components={["TimePicker"]}>
            <TimePicker
              label="เวลาเลิกเรียน"
              value={item.endTime}
              onChange={(newValue) =>
                handleScheduleChange(index, "endTime", newValue)
              }
            />
          </DemoContainer>
        </LocalizationProvider>
      </FormControl>
    </div>
  ))}

  {/* ปุ่มเพิ่มวันที่เรียน */}
  <Button
    variant="contained"
    color="primary"
    onClick={handleAddSchedule}
    style={{ marginTop: "16px" }}
  >
    เพิ่มวันที่เรียน
  </Button>
</div>
  
  );
};

export default TimePickerWithAddButton;
