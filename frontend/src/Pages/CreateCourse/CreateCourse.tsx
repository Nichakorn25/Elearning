import React from 'react';
import './CreateCourse.css';
import Header from '../Component/Header/Header';
import  Button  from "@mui/material/Button";
import  Modal  from '@mui/joy/Modal';
import { ModalDialog} from '@mui/joy';
import Step from '../Component/Step/Step';
import  RecipeReviewCard  from '../Component/Card/Card';

const CreateCourse: React.FC = () => {
    const [open, setOpen] = React.useState<boolean>(false);
    const token = localStorage.getItem("token");
    console.log(token)

    return(
        <header>
        <div className='Header'>
            <Header/>
        </div>
        

        <div className='Section_2'>
            <div className='course'>
                <h3 className='h3_Seach'>รายวิชา (Courses)</h3>
                <React.Fragment>
                    <Button 
                        className='CreateButton'
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
                        >📖สร้างคอร์สเรียน</Button> 

                        <Modal open={open} onClose={() => setOpen(false)}>
                            
                            <ModalDialog sx={{ width: '710px', height: 'auto', margin: 'auto' }}>
                            <Step/>
                            
                                
                            </ModalDialog>
                        </Modal>
                    </React.Fragment>
                    
            </div> 




            <div className='CardLists'>
                    <RecipeReviewCard/>

                
            </div>
        </div>
        </header>
        
        
    );
};

export default CreateCourse;