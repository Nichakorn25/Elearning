import Header from '../Component/Header/Header';
import React from 'react';
import './ManageCourse.css';
import antMenu from '../Component/Menu/antMenu';


const ManageCourse: React.FC = () => {
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

            <div className='topic'>
                <h2 className='h3_Seach'>บทที่ 1</h2>
                
            </div>
            
        </header>
    );
};

export default ManageCourse;