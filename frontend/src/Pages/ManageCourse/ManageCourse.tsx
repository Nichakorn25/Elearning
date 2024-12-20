import Header from '../Component/Header/Header';
import React from 'react';
import './ManageCourse.css';
import Option from '../Component/Menu/antMenu';
import  Button  from "@mui/material/Button";
import  Modal  from '@mui/joy/Modal';
import { DialogContent, DialogTitle, FormControl, FormLabel, Input, Link, ModalDialog, Stack } from '@mui/joy';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

const ManageCourse: React.FC = () => {

    const videoId = "aAkMkVFwAoo";  // videoId ที่ได้จาก URL
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const handleSearch = () => {
        alert('ค้นหาถูกคลิก!');
        // ใส่ logic การค้นหาที่คุณต้องการ เช่น เรียก API หรือกรองข้อมูล
    };

    const [open, setOpen] = React.useState<boolean>(false);

    return(
        <header>
            <div className='Header'>
            <Header/>
            </div>
            <div className='nametopic'>
                <h1 className='h1'>รายวิชา: Operating System</h1>
                <div className='infoCourse'>
                    <h5 className='h3_Seach'>รหัสวิชา: ENG23 4000</h5>
                    <h5 className='h3_Seach'>หน่วยกิต: 4 </h5>
                    <h5 className='h3_Seach'>เวลาเรียน: วันจันทร์ 09:00-12.00, วันจันทร์ 13:00-16.00 </h5>
                    <h5 className='h3_Seach'>คำอธิบาย: สอบกลางภาค 25% สอบปลายภาค  25% Quiz 10% Project 20% Lab assignment 10% Lab exam 10% Total 100% </h5>
                </div>
            </div>

            <div className='MainCss'>
                <div className='topic'>
                    <h2 className='h3_Seach'>บทที่ 1</h2>
                    <Option/>
                    <React.Fragment>
                        <Button 
                                className='CreateLesson'
                                sx={{
                                    fontSize: '15px', // ขนาดของข้อความหรือไอคอน
                                    fontFamily: 'Prompt, sans-serif',
                                    backgroundColor: '#ff6b00', // สีพื้นหลัง
                                    color: 'white', // สีของข้อความหรือไอคอน
                                    padding: '8px 15px', // ระยะห่างภายในปุ่ม
                                    borderRadius: '12px',
                                    transition: 'background-color 0.3s ease',
                                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                    marginLeft: 'auto',
                                    '&:hover': {
                                        backgroundColor: '#f9f9f9', // สีพื้นหลังเมื่อ hover
                                        color: '#333'
                                    },
                                }}
                                onClick={() => setOpen(true)}
                                >📖สร้างบทเรียน</Button> 

                                <Modal open={open} onClose={() => setOpen(false)}>
                                <ModalDialog sx={{ width: '710px', height: 'auto', margin: 'auto' }}>
                                    <h2>สร้างบทเรียน</h2>
                                    <FormControl required>
                                        <FormLabel className="LessonName">ชื่อบทเรียน</FormLabel>
                                        <Input autoFocus required placeholder="eg. บทที่ 1 "/>

                                    </FormControl>
                                    <div className='ButtonLayer'>
                                        <Button className='cancleButton' type="submit">Cancle</Button>
                                        <Button className='submitButton' type="submit" sx={{ marginLeft: 'auto',}} onClick={handleSearch}>Summit</Button>
                                    </div>
                                </ModalDialog>
                                
                                </Modal>
                    </React.Fragment>
                    
                </div>
                <Link
                    component="a" // ใช้ 'a' เพื่อทำให้เป็นลิงก์
                    href="https://www.facebook.com/groups/3136643153145481" // URL ที่จะเชื่อมโยงไป
                    onClick={() => {
                        console.info("I'm a button.");
                    }}
                    >
                    Button Link
                    </Link>

                    <h2>Video Preview</h2>
                    
                        <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer">
                            <img src={thumbnailUrl} alt="Video Thumbnail" width="560" height="315" />
                        </a>
                <Divider sx={{ my: 0.5 }} />
            </div>
            
            
            
        </header>
    );
};

export default ManageCourse;