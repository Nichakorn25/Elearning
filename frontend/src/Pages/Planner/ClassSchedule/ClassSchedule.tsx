import React, { useState } from 'react';
import './ClassSchedule.css';
// import { useNavigate } from 'react-router-dom';
import Header from '../../Component/Header/Header'; // เรียกใช้ Header ที่แยกไว้
import AddSubjectPopup from '../AddSubjectPopup/AddSubjectPopup';
import CreditSummary from '../CreditSummary/CreditSummary';


const ClassSchedule: React.FC = () => {
  // ช่วงเวลา (Time Slots)
  const timeslots = [
    '08:00-09:00',
    '09:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '12:00-13:00',
    '13:00-14:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00',
    '17:00-18:00',
    '18:00-19:00',
    '19:00-20:00',
  ];
  

  // ข้อมูลตารางเรียน (Days & Slots)
  const [schedule, setSchedule] = useState([
    { day: 'จันทร์', slots: Array(timeslots.length).fill('') },
    { day: 'อังคาร', slots: Array(timeslots.length).fill('') },
    { day: 'พุธ', slots: Array(timeslots.length).fill('') },
    { day: 'พฤหัส', slots: Array(timeslots.length).fill('') },
    { day: 'ศุกร์', slots: Array(timeslots.length).fill('') },
  ]);

  const handleSave = () => {
    console.log('Saving schedule...', schedule);
    alert('ตารางเรียนถูกบันทึก!');
  };

  const [isPopupVisible, setPopupVisible] = useState(false);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  return (
    <div className="dashboard">
      {/* Header Section */}
      <Header />
      
      {/* Schedule Table */}
      <section className="schedule-table">
        <h2>ตารางเรียน</h2>
        <table>
          <thead>
          <tr>
            <th>Day</th>
            {timeslots.map((slot, index) => (
              <th key={index}>{slot}</th>
            ))}
          </tr>
          </thead>
          <tbody>
            {schedule.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {/* แสดงชื่อวันในคอลัมน์ Day */}
                <td className="day-name" >{row.day}</td>
                {row.slots.map((slot, slotIndex) => (
                  <td key={slotIndex}>
                    <input
                      type="text"
                      value={slot}
                      onChange={(e) => {
                        const newSchedule = [...schedule];
                        newSchedule[rowIndex].slots[slotIndex] = e.target.value;
                        setSchedule(newSchedule);
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Footer */}
      <footer className="footer">
        <button className="save-button" onClick={handleSave}>
          บันทึกตาราง
        </button>
        <button className="add-course-button" onClick={togglePopup}>เพิ่มวิชา </button>
      </footer>

      <CreditSummary courses={[]} /> {/* ตารางหน่วยกิต */}

      <AddSubjectPopup isVisible={isPopupVisible} onClose={togglePopup} />
    </div>
  );
};

export default ClassSchedule;
