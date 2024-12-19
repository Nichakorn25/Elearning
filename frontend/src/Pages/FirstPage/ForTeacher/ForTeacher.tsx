import React, { useState } from "react";
import "./ForTeacher.css";
import { useNavigate } from "react-router-dom";
import HeaderTabBFLogin from "../../Component/HeaderTabBFLogin/HeaderTabBFLogin";
import LoginPopup from "../LoginPopup/LoginPopup";

const ForTeacher: React.FC = () => {
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
        title: "รายวิชาทั้งหมดบนระบบ",
        description:
          "ระบบ SUT e-Learning แบ่งหมวดหมู่รายวิชาเพื่อให้ผูใช้สามารถเลือกรายวิชาตามหมวดหมู่ของ สำนักวิชา สาขาวิชา และหน่วยงานที่ให้บริการการเรียนการสอนออนไลน์ หรือหลักสูตรอบรมออนไลน์",
      },
      {
        image: "https://via.placeholder.com/300x180",
        title: "เปิดรายวิชาใหม่",
        description:
          "อาจารย์มหาวิทยาลัยเทคโนโลยีสุรนารี สามารถเข้าสู่ระบบและเปิดรายวิชาใหม่ที่ต้องการใช้ในการเรียนการสอนได้ด้วยตนเองผ่านระบบ และเริ่มใช้รายวิชาเพื่อการเรียนการสอนได้ทันที",
      },
      {
        image: "https://via.placeholder.com/300x180",
        title: "คู่มือการใช้งานระบบ",
        description:
          "อาจารย์สามารถเข้าดูคู่มือการใช้งานระบบ SUT e-Learning ซึ่งได้แนะนำการใช้งานระบบสำหรับผู้สอนในการบริหารจัดการรายวิชา ตั้งแต่การตั้งค่ารายวิชา การจัดการเนื้อหา การจัดการการบ้าน และการจัดการแบบทดสอบ เป็นต้น",
      },
      {
        image: "https://via.placeholder.com/300x180",
        title: "การรีเซ็ทรายวิชา",
        description:
          "อาจารย์สามารถรีเซ็ทรายวิชา (Reset Course) เพื่อเตรียมรายวิชาเดิมสำหรับภาคการศึกษาใหม่ ซึ่งเป็นการลบข้อมูลของนักศึกษาที่เคยเข้าเรียนในรายวิชา เช่น รายชื่อนักศึกษา คะแนนการทำแบบทดสอบ ข้อความในกระดานเสวนา และข้อมูลการทำกิจกรรมของนักศึกษา เป็นต้น ไฟล์เนื้อหา สื่อการสอน ลิงก์ การบ้าน และแบบทดสอบ ที่เคยสร้างไว้จะยังคงอยู่ในรายวิชาเหมือนเดิม",
      },
      {
        image: "https://via.placeholder.com/300x180",
        title: "คู่มือการสร้างข้อสอบบนระบบ",
        description:
          "อาจารย์สามารถสร้างข้อสอบออนไลน์บนระบบ SUT e-Learning เพื่อใช้ในการวัดผล หรือสอบเก็บคะแนนในรายวิชาที่ทำการเรียนการสอน โดยคู่มือจะแนะนำวิธีการสร้างข้อสอบ ตั้งแต่การสร้างคำถาม การสร้างชุดข้อสอบ การนำคำถามเข้าชุดข้อสอบ และการตั้งค่าข้อสอบ",
      },
      {
        image: "https://via.placeholder.com/300x180",
        title: "การจัดสอบอย่างปลอดภัยลดทุจริต",
        description:
          "อาจารย์สามารถใชัระบบ SUT e-Learning ร่วมกับโปรแกรม Safe Exam Browser โดยการตั้งค่าข้อสอบบนระบบ SUT e-Learning สำหรับสอบด้วย Safe Exam Browser หรือ SEB ซึ่งเป็น Web browser ที่ล็อคหน้าจอระหว่างทำข้อสอบไม่ให้ผู้สอบเปิดบราวเซอร์หน้าต่างอื่นได้ จึงสามารถป้องกันการทุจริตระหว่างสอบออนไลน์",
      }, {
        image: "https://via.placeholder.com/300x180",
        title: "แจ้งสอบออนไลน์",
        description:
          "อาจารย์สามารถแจ้งวันเวลาที่จะทำการจัดสอบออนไลน์โดยใช้ระบบ SUT e-Learning ซึ่งแจ้งผ่านระบบจองวันเวลาสอบออนไลน์ เพื่อจะได้ดำเนินการจัดเตรียมความพร้อมและดูแลระบบให้สามารถรองรับกับจำนวนผู้เข้าสอบในแต่ละช่วงเวลาให้เป็นไปด้วยความเรียบร้อย",
      },
      {
        image: "https://via.placeholder.com/300x180",
        title: "คำถามที่พบบ่อย (FAQ)",
        description:
          "อาจารย์สามารถเข้าดูคำถามเกี่ยวกับการใช้งานระบบ SUT e-Learning ที่พบบ่อย โดยได้แนะนำการแก้ปัญหาและวิธีการใช้งานไว้ เพื่อเป็นแนวทางสำหรับอาจารย์ในการใช้ระบบให้เป็นไปด้วยความเรียบร้อย",
      },
      {
        image: "https://via.placeholder.com/300x180",
        title: "วิดีโอการอบรมเทคนิคและการสร้างสื่อการเรียนการสอน",
        description:
          "อาจารย์สามารถเข้าดูวิดีโอที่ได้บันทึกจากการอบรมเทคนิค วิธีการใ้ช้ระบบ SUT e-Learning และการสร้างสื่อการเรียนการสอน โดยวิทยากรภายในและภายนอกมหาวิทยาลัย",
      }, {
        image: "https://via.placeholder.com/300x180",
        title: "เครื่องมือสนับสนุนการเรียนการสอน",
        description:
          "อาจารย์สามารถดูวิธีการใช้โปรแกรมและเครื่องมือที่ใช้สนับสนุนการเรียนการสอนในชั้นเรียนในการสร้างกิจกรรมการเรียนรู้ และสร้างการมีส่วนร่วมในการเรียนของนักศึกษา",
      },
  ];

  return (
    <>
      <HeaderTabBFLogin onLoginClick={handleOpenLoginPopup} />

      <div className="for-teacher">
        <h1 className="title">สำหรับอาจารย์ (Teacher)</h1>
        <div className="content-container">
          {data.map((item, index) => (
            <div key={index} className="content-item">
            <img src={item.image} alt={item.title} className="content-image" />
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

export default ForTeacher;

    

