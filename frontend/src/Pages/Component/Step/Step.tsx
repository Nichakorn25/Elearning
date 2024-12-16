import React, { useState } from "react";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DialogContent, DialogTitle, FormControl, FormLabel, Input, Stack } from '@mui/joy';
import './Step.css';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { InputLabel, MenuItem, Select } from '@mui/material';
import TimePick from '../TimePicker/TimePick';

const steps = ['ข้อมูลพื้นฐาน', 'รายละเอียดเพิ่มเติม', 'ยืนยันข้อมูล'];

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const navigate = useNavigate();
  const isStepOptional = (step: number) => step === 1;
  const [value, setValue] = React.useState([null, null])
  const [year, setYear] = useState("");
  const [term, setTerm] = React.useState('');

  const isStepSkipped = (step: number) => skipped.has(step);

  const handleTermChange = (event) => {
    setTerm(event.target.value);
  };

  const handleChange = (event) => {
    setYear(event.target.value); // อัปเดตค่า state
  };

  const handleExit = () => {
    navigate('/createcourse'); // เปลี่ยนเส้นทางไปยังหน้าหลัก
  };

  

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



  // ฟังก์ชันสำหรับการแสดงฟอร์มในแต่ละ Step
  const renderFormContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <h4>Step 1</h4>
            <FormControl required>
              <FormLabel className="custom-form-label">ชื่อบทเรียน</FormLabel>
              <Input autoFocus required placeholder="กรอกชื่อบทเรียน"/>
            </FormControl>
            <FormControl required>
              <FormLabel className="custom-form-label">รหัสวิชา</FormLabel>
              <Input autoFocus required placeholder="กรอกรหัสวิชา"/>
            </FormControl>
            <FormControl required>
              <FormLabel className="custom-form-label">หมวดหมู่</FormLabel>
              <Input required placeholder="เลือกชื่อบทเรียน"/>
            </FormControl>

            <div className="sub_1">
            <FormControl required>
              <FormLabel className="custom-form-label">วันที่เริ่มสอน</FormLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ width: 300 }}>
                  <DateRangePicker
                    startText="วันที่เริ่มต้น"
                    endText="วันที่สิ้นสุด"
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                    renderInput={(startProps, endProps) => (
                      <>
                        <TextField {...startProps} sx={{ mr: 1 }} />
                        <TextField {...endProps} />
                      </>
                    )}
                  />
                </Box>
              </LocalizationProvider>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 120 }} required>
              <FormLabel className="custom-form-label">หน่วยกิต</FormLabel>
              <InputLabel id="credit_course"></InputLabel>
              <Select
                labelId="credit_course"
                id="credit_course_id"
                value={year}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={1}>1.0</MenuItem>
                <MenuItem value={1.5}>1.5</MenuItem>
                <MenuItem value={2}>2.0</MenuItem>
              </Select>
            </FormControl>

            </div>

            <FormControl >
              <FormLabel className="custom-form-label">คำอธิบายบทเรียน</FormLabel>
              <TextField
                id="outlined-multiline-flexible"
                multiline
                maxRows={4}
              />
            </FormControl>
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
                value={year}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={2565}>2565</MenuItem>
                <MenuItem value={2566}>2566</MenuItem>
                <MenuItem value={2567}>2567</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 120 }} required>
              <FormLabel className="custom-form-label">ภาคการศึกษา</FormLabel>
              <InputLabel id="academic-year-term">เลือก</InputLabel>
              <Select
                labelId="academic-year-term"
                id="academic-year-select-term"
                value={term}
                onChange={handleTermChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
              </Select>
            </FormControl>
            </div>

            <div className="time_pick">
            {/* <FormControl sx={{ m: 1, minWidth: 120 }} required>
              <FormLabel className="custom-form-label">วันที่ทำการสอน</FormLabel>
              <InputLabel id="dateOfStudy">เลือกวัน</InputLabel>
              <Select
                labelId="dateOfStudy"
                id="dateOfStudy"
                value={term}
                onChange={handleTermChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={1}>วันจันทร์</MenuItem>
                <MenuItem value={2}>วันอังคาร</MenuItem>
                <MenuItem value={3}>วันพุธ</MenuItem>
              </Select>
            </FormControl>
             */}
            
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <FormLabel className="custom-form-label">เวลาเริ่มเรียน</FormLabel>
              <DemoContainer components={['TimePicker']}>
                <TimePicker label="เวลาเริ่มเรียน" />
              </DemoContainer>
            </LocalizationProvider>

            
            <FormLabel className="custom-form-label">เวลาเลิกเรียน</FormLabel>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['TimePicker']}>
                <TimePicker label="เวลาเลิกเรียน" />
              </DemoContainer>
              </LocalizationProvider> */}

            <TimePick/>
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
            <Typography>ชื่อบทเรียน: ...</Typography>
            <Typography>รหัสบทเรียน: ...</Typography>
            <Typography>คำอธิบาย: ...</Typography>
            <Typography>หมวดหมู่: ...</Typography>
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
              handleNext();
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
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button type="submit">
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </form>
        </React.Fragment>
      )}
    </Box>
  );
}
