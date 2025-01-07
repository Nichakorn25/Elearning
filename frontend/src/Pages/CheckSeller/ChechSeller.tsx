import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckUserExistsInSeller } from "../../services/https";

const CheckSeller: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const userId = localStorage.getItem("id"); // ดึง userId จาก localStorage
      if (!userId) {
        console.error("UserID not found in localStorage");
        navigate("/login"); // หากไม่มี userId ให้ไปหน้า login
        return;
      }

      try {
        const result = await CheckUserExistsInSeller(userId);

        if (result.exists) {
          console.log("Seller exists:", result);

          // บันทึก sellerId จาก API
          if (result.sellerId) {
            localStorage.setItem("sellerId", result.sellerId);
            console.log("Seller ID saved:", result.sellerId); // ตรวจสอบว่าบันทึกสำเร็จ
          } else {
            console.warn("No sellerId found in result");
          }
          

          navigate("/MainSealSheet"); // หากข้อความบ่งชี้ว่ามี userId ใน Seller
        } else {
          console.warn("Seller does not exist:", result.message);
          navigate("/AddSealUser"); // หากข้อความบ่งชี้ว่าไม่มี userId ใน Seller
        }
      } catch (error) {
        console.error("Error checking seller:", error);
        navigate("/error"); // หากเกิดข้อผิดพลาด
      }
    };

    checkUser();
  }, [navigate]);

  return <div>กำลังตรวจสอบ...</div>; // แสดงข้อความระหว่างรอ
};

export default CheckSeller;
