import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckUserExistsInSeller } from "../../services/https";

const CheckSeller: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkUser = async () => {
      const userId = localStorage.getItem("id");
      if (!userId) {
        console.error("UserID not found in localStorage");
        navigate("/"); 
        return;
      }
      try {
        const result = await CheckUserExistsInSeller(userId);

        if (result.exists) {
          console.log("Seller exists:", result);
          if (result.sellerId) {
            localStorage.setItem("sellerId", result.sellerId);
            console.log("Seller ID saved:", result.sellerId); 
          } else {
            console.warn("No sellerId found in result");
          }
          

          navigate("/MainSealSheet"); // หากมี userId ใน Seller
        } else {
          console.warn("Seller does not exist:", result.message);
          navigate("/AddSealUser"); // หากไม่มี userId ใน Seller
        }
      } catch (error) {
        console.error("Error checking seller:", error);
        navigate("/error"); // หากเกิดข้อผิดพลาด
      }
    };

    checkUser();
  }, [navigate]);

  return <div>กำลังตรวจสอบ...</div>;
};

export default CheckSeller;