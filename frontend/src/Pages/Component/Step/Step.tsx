import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DialogContent, FormControl, FormLabel, Input, Stack } from '@mui/joy';
import './Step.css';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { DatePicker, Form } from "antd";
import dayjs from "dayjs";

import { InputLabel, MenuItem, Select, Alert, Dialog, FormHelperText } from '@mui/material';
import { GetCategory, CreateSemester, GetSemesterID, CreateCourse, UploadPicture } from "../../../services/https";
import {DepartmentInterface, SemesterInterface, CoursePictureInterface, CourseInterface} from "../../../Interface/ICourse"
import { SelectChangeEvent } from '@mui/material/Select';
import axios from "axios";
import { message } from 'antd';

const steps = ['ข้อมูลพื้นฐาน', 'รายละเอียดเพิ่มเติม', 'ยืนยันข้อมูล'];



export default function HorizontalLinearStepper() {
  const id = localStorage.getItem("id");
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const navigate = useNavigate();
  const isStepOptional = (step: number) => step === 1;
  const [category, setCategory] = useState<DepartmentInterface[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [semesterID, setsemesterID] = useState<SemesterInterface| undefined>(undefined);
  const [valueCredit, setValueCredit] = useState<number>();
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState(false);
  const [alert, setAlert] = React.useState<{ severity: 'success' | 'error' | 'info' | 'warning', message: string } | null>(null);
  const [courseID, setCourseID] = useState<CourseInterface[]>([]);

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

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // อ่านไฟล์ในรูปแบบ Base64
      reader.onload = () => resolve(reader.result as string); // คืนค่า Base64 string
      reader.onerror = (error) => reject(error); // จัดการข้อผิดพลาด
    });
  };

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);


  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // เลือกไฟล์แรกที่อัปโหลด
    if (file) {
      setUploadedImage(file);
      console.log("Selected file:", file);
    }
  };

  const handleSubmitImage = async () => {
    if (!uploadedImage) {
      console.error("กรุณาเลือกไฟล์รูปภาพก่อน");
      return;
    }
  
    try {
      const base64String = await convertToBase64(uploadedImage);

      let updatedCourseID = 1;
      if (Array.isArray(courseID) && courseID.length > 0) {
        updatedCourseID = courseID[0].ID ? courseID[0].ID + 1 : 1;
      }

      // ส่ง property 'Picture' ตาม interface
      const payload: CoursePictureInterface = {
        Picture: base64String,
        CourseID: updatedCourseID, // ระบุค่า CourseID ถ้าจำเป็น
      };
  
      const response = await UploadPicture(payload);
      console.log("อัปโหลดสำเร็จ:", response.data);
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
    }
  };
  



  interface CourseData {
    CourseName: string,
    Credit: number,
    Description: string,
    Stage: number,
    CategoryID: number,
    UserID: number,
    SemesterID: number,
    Status: string,
  }
  
  const [CourseData, setCourseData] = useState<CourseData>({
    CourseName: "",
    Credit: 0,
    Description: "",
    Stage: 1,
    CategoryID: 0,
    UserID: 0,
    SemesterID: 0,
    Status: "unavailable",

  });


  interface SemesterData {
    Year: number;
    Term: number;
    StartDate: Date | null | undefined;
    EndDate: Date | null | undefined;
  }
  const [semesterData, setSemesterData] = useState<SemesterData>({
    Year: 2567,
    Term: 1,
    StartDate: null,  
    EndDate: null,    
  });

  

  const isStepSkipped = (step: number) => skipped.has(step);

  
  const handleSubmitSemester = async (): Promise<number | undefined> => {
    console.log('Start Date:', semesterData.StartDate);
    console.log('End Date:', semesterData.EndDate);
    console.log('Year:', semesterData.Year);
    console.log('Term:', semesterData.Term);

    if (semesterData.StartDate && semesterData.EndDate) {
      const data = {
        Year: semesterData.Year,
        Term: semesterData.Term,
        // ใช้ dayjs เพื่อแปลงวันที่เป็นรูปแบบ ISO 8601 ที่ API รองรับ
        StartDate: dayjs(semesterData.StartDate).format('YYYY-MM-DDTHH:mm:ss+07:00'),
        EndDate: dayjs(semesterData.EndDate).format('YYYY-MM-DDTHH:mm:ss+07:00'),
      };

      console.log("Start Date after formatting:", data.StartDate);
      console.log("End Date after formatting:", data.EndDate);

      try {
        const response = await CreateSemester(data);
        if (response.status === 200 || response.status === 201) {
          message.success('สร้างคอร์สสำเร็จ!');
          console.log("ข้อมูล Semester ถูกสร้างสำเร็จ");
          
          return response.data.id;
          

        } else {
          message.error('สร้างคอร์สไม่สำเร็จ!');
          console.error("เกิดข้อผิดพลาดในการสร้าง Semester");
          return undefined;
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการส่งข้อมูล:", error);
        return undefined;
      }
    } else {setTimeout(() => {
            setAlert(null);
          }, 3000);
          handleRefresh();
      message.error("กรุณากรอกวันที่เริ่มต้นและสิ้นสุด");
      return undefined;
    }
  };





useEffect(() => {
  console.log(semesterData); // ตรวจสอบค่าของ semesterData
}, [semesterData]);

const handleSubmitCourse = async () => {
  let updatedSemesterID = 1;
  if (semesterID && semesterID.ID) {
      updatedSemesterID = semesterID.ID + 1;
      console.log("User ID: " , updatedSemesterID)
  }
  const dataCourse = {
      CourseName: CourseData.CourseName,
      Credit: valueCredit,
      Description: description,
      Stage: CourseData.Stage,
      CategoryID: selectedCategory,
      UserID: Number(id),
      SemesterID: updatedSemesterID, // ใช้ ID ที่ได้จาก handleSubmitSemester
      Status: "unavailable",
  };

  console.log("DataCourse:", dataCourse);

  try {
      const response = await CreateCourse(dataCourse); // เรียก API สร้าง Course
      console.log(dataCourse);
      console.log(response);

      if (response.status === 200 || response.status === 201) {
          console.log("ข้อมูล Course ถูกสร้างสำเร็จ");
          setError(false);
          handleRefresh();
      } else {
          console.error("เกิดข้อผิดพลาดในการสร้าง Course");
      }
  } catch (error) {
      console.error("เกิดข้อผิดพลาดในการส่งข้อมูล Course:", error);
  }
};

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);  // เก็บค่าใน state เมื่อมีการเปลี่ยนแปลง
  };
  const handleCreditChange = (event: SelectChangeEvent<number>) => {
    setValueCredit(event.target.value as number );  // ใช้ event.target.value ตรง ๆ
  };

  const handleCloseDialog = () => {
    setAlert(null); // ปิด popup เมื่อคลิกปิดหรือหลังจากแสดงข้อความเสร็จ
  };

  const handleRefresh = () => {
    setTimeout(() => {
      window.location.reload(); // รีเฟรชหน้า
    }, 3000);
  };

  const handleExit = () => {
    navigate('/createcourse'); // เปลี่ยนเส้นทางไปยังหน้าหลัก
  };

  React.useEffect(() => {
    const GetAllCategory = async () => {

        try {
          const response = await GetSemesterID();
          console.log(response);  // ตรวจสอบโครงสร้างทั้งหมดของ response
          console.log(response.data);  // ตรวจสอบข้อมูลใน response.data
          setsemesterID(response.data);  // กำหนดเป็น array
        } catch (error) {
          console.error('Error fetching category data:', error);
        }
    };

    GetAllCategory();
  }, []); // Empty dependency array to fetch data on component mount

  React.useEffect(() => {
    const GetAllSemester = async () => {

        try {
          const response = await GetCategory();
          console.log(response);  // ตรวจสอบโครงสร้างทั้งหมดของ response
          console.log("department: ",response.data);  // ตรวจสอบข้อมูลใน response.data
          setCategory(response.data);  // กำหนดเป็น array
        } catch (error) {
          console.error('Error fetching category data:', error);
        }
    };

    GetAllSemester();
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCourseData({
      ...CourseData,
      [name]: value, // อัปเดตฟิลด์ที่กรอก
    });
  };


  const handleCategoryChange = (event: SelectChangeEvent<number>) => {
    setSelectedCategory(Number(event.target.value)); // เก็บค่า ID ของหมวดหมู่ที่เลือก
  };


  console.log(semesterData.StartDate, semesterData.EndDate);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [, setOpenTimePick] = useState(false);
  // ฟังก์ชันเปิด Modal

  
  
  // ฟังก์ชันสำหรับการแสดงฟอร์มในแต่ละ Step
  const renderFormContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <h4>Step 1</h4>
            <FormControl required error={error} >
              <FormLabel className="custom-form-label">ชื่อคอร์ส</FormLabel>
              <Input
                name="CourseName"
                value={CourseData.CourseName}
                onChange={handleInputChange}
                autoFocus
                required
                placeholder="กรอกชื่อบทเรียน"
              />
              {error && <FormHelperText>กรุณากรอกชื่อคอร์ส</FormHelperText>}
            </FormControl>
            <FormControl required>
            <FormLabel className="custom-form-label">หมวดหมู่</FormLabel>
              <Select
                id="cetagorySelect"
                value={selectedCategory || ''}
                onChange={handleCategoryChange}
                displayEmpty
                required
              >
                <MenuItem value="" disabled>
                  เลือกหมวดหมู่
                </MenuItem>
                {category.map((category) => (
                  <MenuItem key={category.ID} value={category.ID}>
                     {category.DepartmentName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="sub_1">
            <FormControl required>
            <FormLabel className="custom-form-label">วันที่เริ่มสอน</FormLabel>
            <div style={{ display: 'flex', gap: '10px' }}>
            <div>
            <Form.Item label="วันที่เริ่มต้น" required>
              <DatePicker
                id='startdate'
                value={semesterData.StartDate ? dayjs(semesterData.StartDate) : null}
                onChange={(date) => {
                  // อัพเดตค่า StartDate เมื่อเลือกวันที่
                  setSemesterData({
                    ...semesterData,
                    StartDate: date ? date.toDate() : null, // ตรวจสอบว่า date มีค่า
                  });
                }}
                format="YYYY-MM-DD"
                placeholder="เลือกวันที่เริ่มต้น"
                getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
              />
            </Form.Item>

            <Form.Item label="วันที่สิ้นสุด" required>
              <DatePicker
                id='startdate'
                value={semesterData.EndDate ? dayjs(semesterData.EndDate) : null}
                onChange={(date) => {
                  // อัพเดตค่า EndDate เมื่อเลือกวันที่
                  setSemesterData({
                    ...semesterData,
                    EndDate: date ? date.toDate() : null, // ตรวจสอบว่า date มีค่า
                  });
                }}
                format="YYYY-MM-DD"
                placeholder="เลือกวันที่สิ้นสุด"
                disabledDate={(current) =>
                  semesterData.StartDate ? current.isBefore(dayjs(semesterData.StartDate), "day") : false
                }
                getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
              />
            </Form.Item>

            </div>

            </div>
          </FormControl>



          <FormControl sx={{ m: 1, minWidth: 120 }} required>
            <FormLabel className="custom-form-label">หน่วยกิต</FormLabel>
            <InputLabel id="credit_course">หน่วยกิต</InputLabel>
            <Select
              labelId="credit_course"
              id="credit_course_id"
              value={valueCredit || ""}
              onChange={handleCreditChange}
              label="หน่วยกิต"
            >
              <MenuItem value="">
                <em>NONE</em>
              </MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
            </Select>
        </FormControl>

            </div>
            <div className="sub_2">
            <FormControl >
              <FormLabel className="custom-form-label">คำอธิบายบทเรียน</FormLabel>
              <TextField
                id="outlined-multiline-flexible"
                multiline
                maxRows={4}
                value={description}  // เชื่อมต่อกับ state
                onChange={handleDescriptionChange}  // ฟังก์ชันที่ใช้จัดการการเปลี่ยนแปลงค่า
              />
            </FormControl>
            </div>
          </>
        );


      case 1:
        return (
          <>
            <h4>Step 2</h4>
            <div className="semiter">
            <FormControl sx={{ m: 1, minWidth: 120 }} required>
              <FormLabel className="custom-form-label">ปีการศึกษา</FormLabel>
              <InputLabel id="academic-year-label">เลือกปี</InputLabel>
              <Select
                labelId="academic-year-label"
                id="academic-year-select"
                value={semesterData.Year}
                onChange={(e) => setSemesterData({ ...semesterData, Year: e.target.value as number })}
              >
                <MenuItem value="">
                  <em>เลือกเทอมปีการศึกษา</em>
                </MenuItem>
                <MenuItem value={2565}>2565</MenuItem>
                <MenuItem value={2566}>2566</MenuItem>
                <MenuItem value={2567}>2567</MenuItem>
                <MenuItem value={2568}>2568</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 120 }} required>
              <FormLabel className="custom-form-label">ภาคการศึกษา</FormLabel>
              <InputLabel id="academic-year-term">เลือก</InputLabel>
              <Select
                labelId="academic-year-term"
                id="academic-year-select-term"
                value={semesterData.Term}
                onChange={(e) => setSemesterData({ ...semesterData, Term: e.target.value as number })}
              >
                <MenuItem value="">
                  <em>เลือกเทอมการศึกษา</em>
                </MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
              </Select>
          </FormControl>
          
          
            </div>

            {/* <div className="time_pick">


            <TimePick/>
            
            </div> */}
            <div className="picturesetting">
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <FormLabel className="custom-form-label">เพิ่มรูปภาพ</FormLabel>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </FormControl>
          {uploadedImage && (
            <Typography variant="body2" sx={{marginLeft: "16px"}}>
              รูปที่เลือก: {uploadedImage.name}
            </Typography>
          )}
          </div>
          </>


          
        );
      case 2:
        return (
          <>
            <h4>Step 3</h4>
            <Typography variant="h6" gutterBottom>
              ตรวจสอบข้อมูลก่อนส่ง
            </Typography>
            <Typography>ชื่อบทเรียน: {CourseData.CourseName}</Typography>
            <Typography>หน่วยกิต: {valueCredit}</Typography>
            <Typography>หมวดหมู่: {category.find((cat) => cat.ID === selectedCategory)?.DepartmentName}</Typography>
            <Typography>ปีการศึกษา: {semesterData.Year}</Typography>
            <Typography>เทอม: {semesterData.Term}</Typography>
          </>
        );

        
        
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: { optional?: React.ReactNode } = {};
          if (isStepOptional(index)) {
            labelProps.optional = <Typography variant="caption">Optional</Typography>;
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel  className="custom-step-label" {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>ทุกขั้นตอนเสร็จสมบูรณ์แล้ว</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleExit}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              if (activeStep === steps.length - 1) {
                handleSubmitSemester(); // ใช้ handleSubmit เมื่อขั้นตอนสุดท้าย
                handleSubmitCourse();
                handleSubmitImage();
                

                setOpenTimePick(true);
              } else {
                handleNext(); // ใช้ handleNext ในขั้นตอนปกติ
              }
            }}
          >
            <DialogContent>
              <Stack spacing={2}>{renderFormContent(activeStep)}</Stack>
            </DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
                
              >
                กลับ
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button type="submit">
                {activeStep === steps.length - 1 ? 'สำเร็จ' : 'ต่อไป'}
              </Button>
              
              <Dialog open={alert !== null} onClose={handleCloseDialog}>
              {alert && (
                <Stack sx={{ width: '100%' }} spacing={2}>
                  <Alert severity={alert.severity}>{alert.message}</Alert>
                </Stack>
              )}
            </Dialog> 
             
            </Box>
            
          </form>
        </React.Fragment>
      )}



    </Box>


  

  );
}