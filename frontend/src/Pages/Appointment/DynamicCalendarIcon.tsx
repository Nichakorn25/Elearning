import React, { useEffect, useState } from "react";

const DynamicCalendarIcon: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // อัปเดตวันที่ทุกวันเวลาเที่ยงคืน
  useEffect(() => {
    const now = new Date();
    const timeUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() -
      now.getTime();

    const timer = setTimeout(() => {
      setCurrentDate(new Date());
    }, timeUntilMidnight);

    return () => clearTimeout(timer); // เคลียร์ timeout เมื่อ component ถูก unmount
  }, [currentDate]);

  const day = currentDate.getDate();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "50px",
        height: "50px",
        backgroundColor: "#ebe3d8",
        borderRadius: "10px",
        position: "relative",
        fontFamily: "Arial, sans-serif",
        color: "black",
      }}
    >
      {/* ด้านบน */}
      <div
        style={{
          backgroundColor: "#cc7152",
          width: "100%",
          height: "15px",
          position: "absolute",
          top: 0,
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        }}
      ></div>
      {/* ด้านล่าง */}
      <div
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginTop: "10px",
        }}
      >
        {day}
      </div>
    </div>
  );
};

export default DynamicCalendarIcon;