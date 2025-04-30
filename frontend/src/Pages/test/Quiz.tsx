import React, { useState } from 'react';
import './Quiz.css';
import { Button, Checkbox, Modal } from 'antd';
import { FieldTimeOutlined } from '@ant-design/icons';

interface QuestionProps {
  question: string;
  choices: string[];
  points: number;
}

const Quiz: React.FC = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // หน้าปัจจุบัน
  const questionsPerPage = 3; // จำนวนคำถามต่อหน้า

  // ข้อมูลคำถาม
  const questions: QuestionProps[] = [
    {
      question: 'ต้องการเก็บข้อมูลว่าในแต่ละข้อทำข้อไหนถูก ข้อไหนผิดบ้าง',
      choices: ['yes', 'no'],
      points: 10,
    },
    {
      question: 'คุณชอบการพัฒนาเว็บไซต์หรือไม่',
      choices: ['Yes', 'No'],
      points: 10,
    },
    {
      question: 'คุณเคยเขียน React มาก่อนหรือไม่',
      choices: ['ใช่', 'ไม่'],
      points: 10,
    },
  ];

  // คำนวณหน้าสุดท้าย
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  // ฟังก์ชันสร้างคำถาม
  const renderQuestion = ({ question, choices, points }: QuestionProps, index: number) => {
    return (
      <div className="component-quiz" key={index}>
        <section className="set-points">
          <div className="place-quiz">
            <div className="quesstion-quiz">{index + 1}. {question}</div>
            {choices.map((choice, idx) => (
              <div className="choice-quiz" key={idx}>
                <Checkbox>{choice}</Checkbox>
              </div>
            ))}
          </div>
          <div className="quiz-points">{points} คะแนน</div>
        </section>
      </div>
    );
  };

  // คำนวณคำถามในหน้าปัจจุบัน
  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  return (
    <div className="quiz">
      <header className="quiz-head"></header>
      <div className="quiz-body">
        <h1>รายวิชา</h1>
      </div>
      <div className="quiz-body2">
        <section className="set-time-quiz">
          <div className="time-quiz">
            <FieldTimeOutlined style={{ fontSize: '32px' }} /> 14.02 น.
          </div>
          <div>
            {/* แสดงคำถามในหน้าปัจจุบัน */}
            {currentQuestions.map((q, index) =>
              renderQuestion(q, currentPage * questionsPerPage + index)
            )}
          </div>
        </section>
        <div className="back-next">
          <Button
            className="back-page"
            type="primary"
            style={{ width: 100 }}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0} // ปิดปุ่มย้อนกลับถ้าอยู่หน้าที่ 1
          >
            ก่อนหน้า
          </Button>
          <Button
            className="next-page"
            type="primary"
            style={{ width: 100 }}
            onClick={() => {
              if (currentPage < totalPages - 1) {
                setCurrentPage(currentPage + 1);
              } else {
                setPopupVisible(true); // แสดง Modal เมื่อจบคำถามทั้งหมด
              }
            }}
          >
            {currentPage === totalPages - 1 ? 'จบแบบทดสอบ' : 'ถัดไป'}
          </Button>
        </div>
      </div>

      {/* Modal สำหรับแสดงเมื่อทำแบบทดสอบเสร็จ */}
      <Modal
        title="เสร็จสิ้น!"
        visible={popupVisible}
        onOk={() => setPopupVisible(false)}
        onCancel={() => setPopupVisible(false)}
        okText="ตกลง"
        cancelText="ยกเลิก"
      >
        <p>ยืนยันการจบแบบทดสอบ</p>
      </Modal>
    </div>
  );
};

export default Quiz;