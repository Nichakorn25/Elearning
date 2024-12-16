import React from "react";
import "./CreditSummary.css";

const CreditSummary: React.FC = () => {
  return (
    <section className="credit-summary">
      <h2>หน่วยกิตรวม 15</h2>
      <table>
        <thead>
          <tr>
            <th>รหัสวิชา - เวอร์ชัน</th>
            <th>ชื่อรายวิชา (หน่วยกิต)</th>
            <th>วัน-เวลาเรียน</th>
            <th>กลุ่ม</th>
            <th>สอบกลางภาค</th>
            <th>สอบประจำภาค</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ENG23 2072 - 1</td>
            <td>
              <strong>ELECTRONIC LABORATORY FOR COMPUTER ENGINEERING (1)</strong>
              <p>ปฏิบัติการอิเล็กทรอนิกส์สำหรับวิศวกรรมคอมพิวเตอร์</p>
              <p className="note">(ทั้งปี) เปิด 22 ลง 2 เหลือ 20</p>
            </td>
            <td>อังคาร 13:00-16:00</td>
            <td>01</td>
            <td>ไม่มีข้อมูล</td>
            <td>ไม่มีข้อมูล</td>
            <td>
              <button className="info-btn">ℹ</button>
              <button className="delete-btn">🗑</button>
            </td>
          </tr>
          <tr>
            <td>ENG23 4041 - 1</td>
            <td>
              <strong>CYBER SECURITY FUNDAMENTALS (4)</strong>
              <p>พื้นฐานความมั่นคงไซเบอร์</p>
              <p className="note">(ทั้งปี) เปิด 56 ลง 56 เหลือ 0</p>
            </td>
            <td>พุธ 16:00-18:00</td>
            <td>01</td>
            <td>ไม่มีข้อมูล</td>
            <td>
              27 ม.ค. 2568 เวลา 13:00 - 16:00<br />
              อาคาร B ห้อง N
            </td>
            <td>
              <button className="info-btn">ℹ</button>
              <button className="delete-btn">🗑</button>
            </td>
          </tr>
          {/* เพิ่มแถวอื่นๆ ได้ */}
        </tbody>
      </table>
    </section>
  );
};

export default CreditSummary;
