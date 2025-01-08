import React, { useState, useEffect, useRef } from "react";
import { Button, Typography, Card, Layout, message } from "antd";
import { useNavigate } from "react-router-dom";
import { ListSheetsBySellerId } from "../../services/https"; // Import ฟังก์ชัน ListSheets จาก service
import Sidebar from "../Component/Sidebar/Sidebar";
import Header from "../Component/Header/Header";
import "./MainSealSheet.css";
import { SheetInterface } from "../../Interface/Sheet";

const { Content } = Layout;
const { Title, Text } = Typography;

const MainSealSheet: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [sheets, setSheets] = useState<SheetInterface[]>([]); // เก็บข้อมูลชีทที่ดึงจากฐานข้อมูล
  const [loading, setLoading] = useState(false);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]); // สร้าง Ref สำหรับ canvas

  useEffect(() => {
    const fetchSheets = async () => {
      const sellerID = parseInt(localStorage.getItem("sellerId") || "0", 10);
      if (!sellerID) {
        console.error("SellerID not found in localStorage");
        return;
      }

      const response = await ListSheetsBySellerId(sellerID);
      if (response?.data) {
        setSheets(response.data);
      } else {
        console.error("Failed to fetch sheets");
      }
      setLoading(false);
    };

    fetchSheets();
  }, []);

 useEffect(() => {
    const radius = 10; // Radius for rounded corners
    canvasRefs.current.forEach((canvas, index) => {
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx && sheets[index]) {
          const sheet = sheets[index];

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Background
          ctx.fillStyle = "#f2a900";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Border
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2;
          ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

          // Course Code
          ctx.fillStyle = "#000";
          ctx.font = "bold 30px Arial";
          ctx.textAlign = "center";
          ctx.fillText(sheet.Course?.CourseDate || "No Course Code", canvas.width / 2, 60);

          // Title
          ctx.fillStyle = "#000";
          ctx.font = "bold 20px Arial";
          ctx.fillText(sheet.Title || "No Title", canvas.width / 2, 100);

          // Seller Name
          ctx.fillStyle = "red";
          ctx.font = "16px Arial";
          ctx.fillText(`By ${sheet.Seller?.Name || "No Seller"}`, canvas.width / 2, 130);

          // Edition
          ctx.fillStyle = "#000";
          ctx.font = "16px Arial";
          ctx.fillText(`ฉบับ ${sheet.Term || "N/A"} / ${sheet.Year || "N/A"}`, canvas.width / 2, 160);

          // Price (Rounded Button)
          const price = `${sheet.Price || "0"} BAHT`;
          const priceWidth = ctx.measureText(price).width + 20;
          const priceX = canvas.width / 2 - priceWidth / 2;
          const priceY = 200;

          ctx.fillStyle = "red";
          ctx.beginPath();
          ctx.moveTo(priceX + radius, priceY - 20);
          ctx.lineTo(priceX + priceWidth - radius, priceY - 20);
          ctx.quadraticCurveTo(priceX + priceWidth, priceY - 20, priceX + priceWidth, priceY - 20 + radius);
          ctx.lineTo(priceX + priceWidth, priceY + 10 - radius);
          ctx.quadraticCurveTo(priceX + priceWidth, priceY + 10, priceX + priceWidth - radius, priceY + 10);
          ctx.lineTo(priceX + radius, priceY + 10);
          ctx.quadraticCurveTo(priceX, priceY + 10, priceX, priceY + 10 - radius);
          ctx.lineTo(priceX, priceY - 20 + radius);
          ctx.quadraticCurveTo(priceX, priceY - 20, priceX + radius, priceY - 20);
          ctx.closePath();
          ctx.fill();

          // Price Text
          ctx.fillStyle = "#FFF";
          ctx.font = "bold 16px Arial";
          ctx.fillText(price, canvas.width / 2, priceY - 5);
        }
      }
    });
  }, [sheets]);

  const handleNewSheetClick = () => {
    navigate("/AddSheet");
  };

  const handleEditSealUserClick = () => {
    navigate("/EditSealUser");
  };

  return (
    <Layout className="sheet">
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
      <Layout>
        <Header />
        <Content className="mainseaalsheet-content">
          <div className="buttonContainer">
            <Button
              type="primary"
              className="greenButton"
              onClick={handleNewSheetClick}
            >
              เพิ่มชีทสรุป
            </Button>
            <Button
              className="yellowButton"
              onClick={() => navigate("/IncomeHistory")}
            >
              ประวัติรายได้
            </Button>
            <Button
              className="yellowButton"
              onClick={handleEditSealUserClick}
            >
              แก้ไข/ดู บัญชี
            </Button>
          </div>
          <Title level={4} className="footerTitle">
            ชีทสรุปที่เผยแพร่
          </Title>
          <Text className="footerNote">คลิกที่ชื่อชีทเพื่อแก้ไขข้อมูล</Text>
          <div className="Sheetlist">
            {loading ? (
              <p>กำลังโหลดข้อมูล...</p>
            ) : sheets.length > 0 ? (
              sheets.map((sheet, index) => (
              <Card className="mainseaalsheet-card"
                key={sheet.ID}
                cover={
                  <canvas
                  ref={(el) => {
                    canvasRefs.current[index] = el;
                  }}
                  width={300}
                  height={200}
                />
                }
                hoverable
                onClick={() => navigate(`/EditSheet/${sheet.ID}`)}// ลิงก์ไปหน้าแก้ไขชีท
              >
                <div className="purchased-info">{`ซื้อไปแล้ว: ${
                  sheet.PurchaseCount || 0
                }`}</div>
              </Card>

              ))
            ) : (
              <p>ไม่มีข้อมูลชีทที่เผยแพร่</p>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainSealSheet;
