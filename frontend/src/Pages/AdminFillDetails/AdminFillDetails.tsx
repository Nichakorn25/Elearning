// import React, { useState } from 'react';
// import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box } from '@mui/material';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import Sidebar from '../Component/Sidebar/Sidebar';
// import Header from '../Component/Header/Header';
// import './AdminFillDetails.css';

// const AdminFillDetails: React.FC = () => {
//     const [isSidebarVisible, setSidebarVisible] = useState(false);
//   const [formData, setFormData] = useState({
//     courseName: '',
//     courseCode: '',
//     category: '',
//     description: '',
//     dateRange: [null, null],
//     academicYear: '',
//     term: '',
//     credits: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (name: string) => (e: React.ChangeEvent<{ value: unknown }>) => {
//     setFormData((prev) => ({ ...prev, [name]: e.target.value }));
//   };

//   const toggleSidebar = () => {
//     setSidebarVisible(!isSidebarVisible);
//   };

//   const handleSave = () => {
//     console.log('Saved Data:', formData);
//     alert('ข้อมูลถูกบันทึกแล้ว!');
//   };

//   return (
//     <div className="admin-dashboard">
//       <Header />
//       {isSidebarVisible && <Sidebar isVisible={isSidebarVisible} />}

//       <div className="content">
//         <div className="form-container">
//           <h2>กรอกข้อมูลเพิ่มเติม (Fill Additional Details)</h2>
//           <form>
//             {/* Course Name */}
//             <TextField
//               label="ชื่อบทเรียน (Course Name)"
//               name="courseName"
//               value={formData.courseName}
//               onChange={handleChange}
//               fullWidth
//               required
//             />

//             {/* Course Code */}
//             <TextField
//               label="รหัสวิชา (Course Code)"
//               name="courseCode"
//               value={formData.courseCode}
//               onChange={handleChange}
//               fullWidth
//               required
//             />

//             {/* Category */}
//             <TextField
//               label="หมวดหมู่ (Category)"
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               fullWidth
//               required
//             />

//             {/* Description */}
//             <TextField
//               label="คำอธิบาย (Description)"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               multiline
//               rows={4}
//               fullWidth
//             />

//             {/* Date Range */}
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <DateRangePicker
//                 startText="วันที่เริ่มต้น (Start Date)"
//                 endText="วันที่สิ้นสุด (End Date)"
//                 value={formData.dateRange}
//                 onChange={(newValue) => setFormData((prev) => ({ ...prev, dateRange: newValue })) }
//                 renderInput={(startProps, endProps) => (
//                   <>
//                     <TextField {...startProps} sx={{ mr: 2 }} fullWidth />
//                     <TextField {...endProps} fullWidth />
//                   </>
//                 )}
//               />
//             </LocalizationProvider>

//             {/* Academic Year */}
//             <FormControl fullWidth>
//               <InputLabel>ปีการศึกษา (Academic Year)</InputLabel>
//               <Select
//                 value={formData.academicYear}
//                 onChange={handleSelectChange('academicYear')}
//                 required
//               >
//                 <MenuItem value="2565">2565</MenuItem>
//                 <MenuItem value="2566">2566</MenuItem>
//                 <MenuItem value="2567">2567</MenuItem>
//               </Select>
//             </FormControl>

//             {/* Term */}
//             <FormControl fullWidth>
//               <InputLabel>ภาคการศึกษา (Term)</InputLabel>
//               <Select
//                 value={formData.term}
//                 onChange={handleSelectChange('term')}
//                 required
//               >
//                 <MenuItem value="1">1</MenuItem>
//                 <MenuItem value="2">2</MenuItem>
//                 <MenuItem value="3">3</MenuItem>
//               </Select>
//             </FormControl>

//             {/* Credits */}
//             <FormControl fullWidth>
//               <InputLabel>หน่วยกิต (Credits)</InputLabel>
//               <Select
//                 value={formData.credits}
//                 onChange={handleSelectChange('credits')}
//                 required
//               >
//                 <MenuItem value="1">1.0</MenuItem>
//                 <MenuItem value="1.5">1.5</MenuItem>
//                 <MenuItem value="2">2.0</MenuItem>
//               </Select>
//             </FormControl>

//             {/* Save Button */}
//             <Button
//               sx={{
//                 backgroundColor: '#4caf50',
//                 color: 'white',
//                 padding: '10px 20px',
//                 borderRadius: '8px',
//                 '&:hover': {
//                   backgroundColor: '#388e3c',
//                 },
//               }}
//               onClick={handleSave}
//             >
//               บันทึกข้อมูล
//             </Button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminFillDetails;
