import React, { useState } from "react";
import { FormControl, FormLabel, Select, MenuItem, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Dayjs } from "dayjs";
import "./TimePick.css";
import { DayofWeekInterface, CourseInterface } from "../../../Interface/ICourse";
import { SelectChangeEvent } from "@mui/material/Select";
import { GetDayOfWeek, CreateStudyTime } from "../../../services/https";
import axios from "axios";
import { Alert , Stack } from '@mui/material';
import { useParams } from "react-router-dom";



interface Schedule {
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  courseID: number;
  dayofweekID: number | null;
}

const TimePickerWithAddButton: React.FC = () => {
  const { id } = useParams();
  const [dayofweek, setDayOfWeek] = useState<DayofWeekInterface[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([
    { startTime: null, endTime: null, courseID: 0, dayofweekID: null },
  ]);
  const [, setCourseID] = useState<CourseInterface | null>(null);
  const [alert, setAlert] = React.useState<{ severity: 'success' | 'error' | 'info' | 'warning', message: string } | null>(null);


  const handleScheduleChange = (index: number, field: keyof Schedule, value: any) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
  };

  const handleDayOfWeekChange = (index: number, event: SelectChangeEvent<number>) => {
    const newSchedule = [...schedule];
    newSchedule[index].dayofweekID = Number(event.target.value);
    setSchedule(newSchedule);
  };



  const handleStudyTime = async () => {
    try {
      let updatedCourseID = 0;
      
      
      if (id) {
        updatedCourseID = Number(id);
      }
        
      console.log(updatedCourseID)
      
      const dataStudyTime = {
        StudyTimeStart: schedule[0]?.startTime
          ? schedule[0]?.startTime.format('YYYY-MM-DDTHH:mm:ssZ') // ใช้รูปแบบที่รวม Timezone
          : undefined,
        StudyTimeEnd: schedule[0]?.endTime
          ? schedule[0]?.endTime.format('YYYY-MM-DDTHH:mm:ssZ')
          : undefined,
        CourseID: updatedCourseID,
        DayofWeekID: schedule[0]?.dayofweekID ?? undefined,
      };
    
      console.log("Study:", dataStudyTime);
  
    
        const response = await CreateStudyTime(dataStudyTime); // เรียก API สร้าง Course
        console.log(dataStudyTime);
        console.log(response);
  
        if (response.status === 200 || response.status === 201) {
          setAlert({ severity: 'success', message: 'เวลาเรียนถูกสร้างสำเร็จ!' });

          setTimeout(() => {
            setAlert(null);
          }, 3000);
        } else {
            console.error("เกิดข้อผิดพลาดในการสร้าง ");
            setAlert({ severity: 'error', message: 'เกิดข้อผิดพลาดในการสร้างเวลาเรียน' });

            setTimeout(() => {
              setAlert(null);
            }, 3000);
        }
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการส่งข้อมูล:", error);
        setAlert({ severity: 'error', message: 'เกิดข้อผิดพลาดในการส่งข้อมูล' });

        setTimeout(() => {
          setAlert(null);
        }, 3000);
    }
  };

  React.useEffect(() => {
    const GetAllDayOfWeek = async () => {
      try {
        const response = await GetDayOfWeek();
        console.log(response); // ตรวจสอบโครงสร้างทั้งหมดของ response
        setDayOfWeek(response.data); // กำหนดเป็น array
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };
    GetAllDayOfWeek();
  }, []);

  React.useEffect(() => {
    const GetCouresBYDesc = async () => {
      try {
         // หรือจากที่เก็บ token อื่นๆ
        const response = await axios.get("https://api.se-elearning.online/createcourse/getcoures", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        console.log("Course data fetched:", response);
        setCourseID(response.data)
        return response;
      } catch (error) {
        console.error("Error fetching course data:", error);
        return null; // หรือคืนค่าบางอย่างในกรณีที่เกิดข้อผิดพลาด
      }
    };

    GetCouresBYDesc();
  }, []);

  

  return (
    <div className="time_pick">
      {alert && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert severity={alert.severity}>{alert.message}</Alert>
        </Stack>
      )}
      {schedule.map((item, index) => (
        <div key={index} className="sub_1">
          {/* วันที่ทำการสอน */}
          <FormControl sx={{ m: 1, minWidth: 120 }} required>
            <FormLabel className="custom-form-label">วันที่ทำการสอน</FormLabel>
            <Select
              id="dayofweek"
              value={item.dayofweekID || ""}
              onChange={(event) => handleDayOfWeekChange(index, event)}
              displayEmpty
              required
            >
              <MenuItem value="" disabled>
                เลือกวัน
              </MenuItem>
              {dayofweek.map((dayofweek) => (
                <MenuItem key={dayofweek.ID} value={dayofweek.ID}>
                  {dayofweek.DayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* เวลาเริ่มเรียน */}
          <FormControl sx={{ m: 1, minWidth: 120 }} required>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <FormLabel className="custom-form-label">เวลาเริ่มเรียน</FormLabel>
              <DemoContainer components={["TimePicker"]}>
              <TimePicker
                label="เวลาเริ่มเรียน"
                views={['hours']}
                value={item.startTime}
                onChange={(newValue) => handleScheduleChange(index, "startTime", newValue)}
                disableIgnoringDatePartForTimeValidation
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
                views={['hours']}
                value={item.endTime}
                onChange={(newValue) => handleScheduleChange(index, "endTime", newValue)}
                disableIgnoringDatePartForTimeValidation
              />
              </DemoContainer>
            </LocalizationProvider>
          </FormControl>
        </div>
      ))}


      <Button
        variant="contained"
        color="primary"
        onClick={handleStudyTime}
        style={{ marginTop: "16px" }}
      >
        ตกลง
      </Button>
    </div>
  );
};

export default TimePickerWithAddButton;