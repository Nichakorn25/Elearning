import React, { useState } from "react";
import "./ForStudent.css";
import LoginPopup from "../LoginPopup/LoginPopup";
import HeaderTabBFLogin from "../../Component/HeaderTabBFLogin/HeaderTabBFLogin";
import Student01 from "../../../assets/student01.jpeg" 
import Student02 from "../../../assets/student02.jpeg" 
import Student03 from "../../../assets/student03.jpeg" 
import Student04 from "../../../assets/student04.jpeg" 
import Student05 from "../../../assets/student05.jpeg" 
import Student06 from "../../../assets/student06.jpeg" 
import Student07 from "../../../assets/student07.jpeg" 
import Student08 from "../../../assets/student08.jpeg" 
import Student09 from "../../../assets/student09.jpeg" 
import Student10 from "../../../assets/student10.jpeg" 
import Student11 from "../../../assets/student11.jpeg" 


const ForStudent: React.FC = () => {
  const [isLoginPopupVisible, setLoginPopupVisible] = useState(false);

  // ฟังก์ชันแสดง Popup
  const handleOpenLoginPopup = () => {
    setLoginPopupVisible(true);
  };

  // ฟังก์ชันซ่อน Popup
  const closeLoginPopup = () => {
    setLoginPopupVisible(false);
  };

  const data = [
    {
      image: Student01,
      title: "รายวิชาที่ลงทะเบียน",
      description:
        "นักศึกษาสามารถดูรายวิชาที่ได้ลงทะเบียนในระบบ SE e-Learning พร้อมเนื้อหา เอกสารการเรียน และกิจกรรมต่าง ๆ ที่เกี่ยวข้อง เพื่อสนับสนุนการเรียนออนไลน์ได้อย่างครบถ้วน",
    },
    {
      image: Student02,
      title: "ลงทะเบียนรายวิชาใหม่",
      description:
        "นักศึกษาสามารถลงทะเบียนรายวิชาใหม่ได้ผ่านระบบ SE e-Learning และเริ่มต้นการเรียนรู้ในรายวิชาที่เปิดสอนสำหรับภาคการศึกษาปัจจุบันได้ทันที",
    },
    {
      image: Student03,
      title: "คู่มือการใช้งานสำหรับนักศึกษา",
      description:
        "นักศึกษาสามารถเข้าดูคู่มือการใช้งานระบบ SE e-Learning ที่แนะนำวิธีการเรียนออนไลน์ เช่น การส่งการบ้าน การทำแบบทดสอบ และการตรวจสอบผลการเรียน",
    },
    {
      image: Student04,
      title: "รีเซ็ตข้อมูลรายวิชาเก่า",
      description:
        "สำหรับนักศึกษาที่เรียนรายวิชาใหม่ ระบบจะล้างข้อมูลการเรียนการสอนจากภาคการศึกษาเดิม เช่น คะแนน การทำแบบทดสอบ และข้อมูลกิจกรรม เพื่อเตรียมความพร้อมสำหรับการเรียนใหม่ในภาคการศึกษาปัจจุบัน",
    },
    {
      image: Student05,
      title: "คู่มือการสร้างข้อสอบบนระบบ",
      description:
        "อาจารย์สามารถสร้างข้อสอบออนไลน์บนระบบ SE e-Learning เพื่อใช้ในการวัดผล หรือสอบเก็บคะแนนในรายวิชาที่ทำการเรียนการสอน โดยคู่มือจะแนะนำวิธีการสร้างข้อสอบ ตั้งแต่การสร้างคำถาม การสร้างชุดข้อสอบ การนำคำถามเข้าชุดข้อสอบ และการตั้งค่าข้อสอบ",
    },
    {
      image: Student06,
      title: "วิธีการทำข้อสอบออนไลน์",
      description:
        "นักศึกษาสามารถศึกษาคู่มือการทำข้อสอบออนไลน์บนระบบ SE e-Learning ตั้งแต่การเข้าสู่ระบบ การเริ่มทำข้อสอบ และการตรวจสอบสถานะการส่งข้อสอบ",
    },
    {
      image: Student07,
      title: "การสอบออนไลน์อย่างปลอดภัย",
      description:
        "นักศึกษาสามารถเข้าสอบออนไลน์ได้อย่างปลอดภัยผ่านระบบ Safe Exam Browser (SEB) ซึ่งช่วยป้องกันการทุจริตระหว่างสอบ และรักษาความเรียบร้อยของการสอบออนไลน์",
    },      
    {
      image: Student08,
      title: "การแจ้งเตือนการสอบ",
      description:
        "นักศึกษาจะได้รับการแจ้งเตือนวันและเวลาสอบออนไลน์ผ่านระบบ SE e-Learning เพื่อให้สามารถเตรียมตัวและจัดการเวลาได้อย่างเหมาะสม",
    },      
    {
      image: Student09,
      title: "คำถามที่พบบ่อย (FAQ)",
      description:
        "นักศึกษาสามารถเข้าดูคำถามที่พบบ่อยเกี่ยวกับการใช้งานระบบ SE e-Learning พร้อมคำแนะนำและวิธีแก้ไขปัญหาที่อาจเกิดขึ้น เพื่อช่วยให้การใช้งานระบบเป็นไปอย่างราบรื่น",
    },      
    {
      image: Student10,
      title: "วิดีโอแนะนำการใช้งานระบบ",
      description:
        "นักศึกษาสามารถดูวิดีโอแนะนำการใช้งานระบบ SE e-Learning ซึ่งมีข้อมูลเกี่ยวกับการจัดการเนื้อหา การส่งงาน การสอบออนไลน์ และฟีเจอร์อื่น ๆ ที่จำเป็นต่อการเรียน",
    }, 
    {
      image: Student11,
      title: "เครื่องมือช่วยการเรียนรู้",
      description:
        "นักศึกษาสามารถเข้าถึงเครื่องมือช่วยการเรียนรู้ เช่น โปรแกรมหรือแอปพลิเคชันเสริมที่ช่วยให้การเรียนออนไลน์มีประสิทธิภาพมากขึ้น เช่น การสร้างกิจกรรม หรือการมีส่วนร่วมในชั้นเรียน",
    },           
  ];

  return (
    <>
      <HeaderTabBFLogin onLoginClick={handleOpenLoginPopup} />

      <div className="for-teacher">
        <h1 className="titleforteacher">สำหรับนักศึกษา (Student)</h1>
        <div className="content-container">
          {data.map((item, index) => (
            <div key={index} className="content-item">
              <img
                src={item.image}
                alt={item.title}
                className="content-image"
              />
              <div className="content-details">
                <h3 className="content-title">{item.title}</h3>
                <p className="content-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {isLoginPopupVisible && <LoginPopup onClose={closeLoginPopup} />}
      </div>
    </>
  );
};

export default ForStudent;