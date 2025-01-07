// import React, { useState } from 'react';
// import './CreateCourse.css';
// import { useNavigate } from 'react-router-dom';
// import Header from '../Component/Header/Header';
// import TextField from '@mui/material/TextField';
// import  Button  from "@mui/material/Button";
// import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined';
// import Card from '../Component/Card/Card';
// import  Modal  from '@mui/joy/Modal';
// import { DialogContent, DialogTitle, FormControl, FormLabel, Input, ModalDialog, Stack } from '@mui/joy';
// import Step from '../Component/Step/Step';


// const CreateCourse: React.FC = () => {
//     const [open, setOpen] = React.useState<boolean>(false);

//     const handleSearch = () => {
//         alert('ค้นหาถูกคลิก!');
//         // ใส่ logic การค้นหาที่คุณต้องการ เช่น เรียก API หรือกรองข้อมูล
//     };

    

//     return(
//         <header>
//         <div className='Header'>
//             <Header/>
//         </div>
        

//         {/* ส่วนในการค้นหา */}

//         <div className='Section'>
//             <div className='Section_1'>
//                 <div className='Seach_bar'>
//                     <h3 className='h3_Seach'>ค้นหาชื่อรายวิชา (Search courses)</h3>
//                     <div className='line_1'>
//                         <TextField fullWidth label="Search" id="fullWidth" />
//                         <Button
//                             className="Search_button"
//                             sx={{
//                                 fontSize: '24px', // ขนาดของข้อความหรือไอคอน
//                                 backgroundColor: '#ff6b00', // สีพื้นหลัง
//                                 color: 'white', // สีของข้อความหรือไอคอน
//                                 padding: '10px 25px', // ระยะห่างภายในปุ่ม
//                                 boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
//                                 transition: 'background-color 0.3s ease',
//                                 '&:hover': {
//                                     backgroundColor: '#f9f9f9', // สีพื้นหลังเมื่อ hover
                                    
//                                 },
//                             }}
//                             >
//                             <SearchOutlined onClick={handleSearch} style={{ fontSize: '24px', color: 'white' }} />
//                         </Button>
                        
//                     </div>

//                 </div>
//             </div>
//         </div>


//         {/* แสดงบทเรียนและปุ่มสร้าง */}

//         <div className='Section_2'>
//             <div className='course'>
//                 <h3 className='h3_Seach'>รายวิชา (Courses)</h3>
//                 <React.Fragment>
//                     <Button 
//                         className='CreateButton'
//                         sx={{
//                             fontSize: '15px', // ขนาดของข้อความหรือไอคอน
//                             fontFamily: 'Open Sans , sans-serif',
//                             backgroundColor: '#ff6b00', // สีพื้นหลัง
//                             color: 'white', // สีของข้อความหรือไอคอน
//                             padding: '8px 15px', // ระยะห่างภายในปุ่ม
//                             borderRadius: '12px',
//                             transition: 'background-color 0.3s ease',
//                             boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
//                             marginLeft: 'auto',
//                             '&:hover': {
//                                 backgroundColor: '#f9f9f9', // สีพื้นหลังเมื่อ hover
//                                 color: '#333'
//                             },
//                         }}
//                         onClick={() => setOpen(true)}
//                         >📖สร้างบทเรียน</Button> 

//                         <Modal open={open} onClose={() => setOpen(false)}>
                            
//                             <ModalDialog sx={{ width: '710px', height: 'auto', margin: 'auto' }}>
//                             <Step/>
                            
                                
//                             </ModalDialog>
//                         </Modal>
//                     </React.Fragment>
                    
//             </div> 




//             <div className='CardLists'>
//                 <Card/> 
//                 <Card/> 
//                 <Card/> 
//             </div>
            
//         </div>
//         </header>
        
        
//     );
// };

// export default CreateCourse;