import React, { useState } from "react";
import "./ForStudent.css";
import { useNavigate } from "react-router-dom";
import LoginPopup from "../LoginPopup/LoginPopup";
import HeaderTabBFLogin from "../../Component/HeaderTabBFLogin/HeaderTabBFLogin";

const ForStudent: React.FC = () => {
  const [isLoginPopupVisible, setLoginPopupVisible] = useState(false);
  const navigate = useNavigate();

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
      image: "https://via.placeholder.com/300x180",
      title: "รายวิชาที่ลงทะเบียน",
      description:
        "นักศึกษาสามารถดูรายวิชาที่ได้ลงทะเบียนในระบบ SUT e-Learning พร้อมเนื้อหา เอกสารการเรียน และกิจกรรมต่าง ๆ ที่เกี่ยวข้อง เพื่อสนับสนุนการเรียนออนไลน์ได้อย่างครบถ้วน",
    },
    {
      image: "https://via.placeholder.com/300x180",
      title: "ลงทะเบียนรายวิชาใหม่",
      description:
        "นักศึกษาสามารถลงทะเบียนรายวิชาใหม่ได้ผ่านระบบ SUT e-Learning และเริ่มต้นการเรียนรู้ในรายวิชาที่เปิดสอนสำหรับภาคการศึกษาปัจจุบันได้ทันที",
    },
    {
      image: "https://via.placeholder.com/300x180",
      title: "คู่มือการใช้งานสำหรับนักศึกษา",
      description:
        "นักศึกษาสามารถเข้าดูคู่มือการใช้งานระบบ SUT e-Learning ที่แนะนำวิธีการเรียนออนไลน์ เช่น การส่งการบ้าน การทำแบบทดสอบ และการตรวจสอบผลการเรียน",
    },
    {
      image: "https://via.placeholder.com/300x180",
      title: "รีเซ็ตข้อมูลรายวิชาเก่า",
      description:
        "สำหรับนักศึกษาที่เรียนรายวิชาใหม่ ระบบจะล้างข้อมูลการเรียนการสอนจากภาคการศึกษาเดิม เช่น คะแนน การทำแบบทดสอบ และข้อมูลกิจกรรม เพื่อเตรียมความพร้อมสำหรับการเรียนใหม่ในภาคการศึกษาปัจจุบัน",
    },
    {
      image: "https://via.placeholder.com/300x180",
      title: "คู่มือการสร้างข้อสอบบนระบบ",
      description:
        "อาจารย์สามารถสร้างข้อสอบออนไลน์บนระบบ SUT e-Learning เพื่อใช้ในการวัดผล หรือสอบเก็บคะแนนในรายวิชาที่ทำการเรียนการสอน โดยคู่มือจะแนะนำวิธีการสร้างข้อสอบ ตั้งแต่การสร้างคำถาม การสร้างชุดข้อสอบ การนำคำถามเข้าชุดข้อสอบ และการตั้งค่าข้อสอบ",
    },
    {
      image: "https://via.placeholder.com/300x180",
      title: "วิธีการทำข้อสอบออนไลน์",
      description:
        "นักศึกษาสามารถศึกษาคู่มือการทำข้อสอบออนไลน์บนระบบ SUT e-Learning ตั้งแต่การเข้าสู่ระบบ การเริ่มทำข้อสอบ และการตรวจสอบสถานะการส่งข้อสอบ",
    },
    {
      image: "https://via.placeholder.com/300x180",
      title: "การสอบออนไลน์อย่างปลอดภัย",
      description:
        "นักศึกษาสามารถเข้าสอบออนไลน์ได้อย่างปลอดภัยผ่านระบบ Safe Exam Browser (SEB) ซึ่งช่วยป้องกันการทุจริตระหว่างสอบ และรักษาความเรียบร้อยของการสอบออนไลน์",
    },      
    {
      image: "https://via.placeholder.com/300x180",
      title: "การแจ้งเตือนการสอบ",
      description:
        "นักศึกษาจะได้รับการแจ้งเตือนวันและเวลาสอบออนไลน์ผ่านระบบ SUT e-Learning เพื่อให้สามารถเตรียมตัวและจัดการเวลาได้อย่างเหมาะสม",
    },      
    {
      image: "https://via.placeholder.com/300x180",
      title: "คำถามที่พบบ่อย (FAQ)",
      description:
        "นักศึกษาสามารถเข้าดูคำถามที่พบบ่อยเกี่ยวกับการใช้งานระบบ SUT e-Learning พร้อมคำแนะนำและวิธีแก้ไขปัญหาที่อาจเกิดขึ้น เพื่อช่วยให้การใช้งานระบบเป็นไปอย่างราบรื่น",
    },      
    {
      image: "https://via.placeholder.com/300x180",
      title: "วิดีโอแนะนำการใช้งานระบบ",
      description:
        "นักศึกษาสามารถดูวิดีโอแนะนำการใช้งานระบบ SUT e-Learning ซึ่งมีข้อมูลเกี่ยวกับการจัดการเนื้อหา การส่งงาน การสอบออนไลน์ และฟีเจอร์อื่น ๆ ที่จำเป็นต่อการเรียน",
    }, 
    {
      image: "https://via.placeholder.com/300x180",
      title: "เครื่องมือช่วยการเรียนรู้",
      description:
        "นักศึกษาสามารถเข้าถึงเครื่องมือช่วยการเรียนรู้ เช่น โปรแกรมหรือแอปพลิเคชันเสริมที่ช่วยให้การเรียนออนไลน์มีประสิทธิภาพมากขึ้น เช่น การสร้างกิจกรรม หรือการมีส่วนร่วมในชั้นเรียน",
    },           
  ];

  return (
    <>
      <HeaderTabBFLogin onLoginClick={handleOpenLoginPopup} />

      <div className="for-teacher">
        <h1 className="title">สำหรับนักศึกษา (Student)</h1>
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
