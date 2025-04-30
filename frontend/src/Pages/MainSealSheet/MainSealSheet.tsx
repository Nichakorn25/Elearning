import React, { useState, useEffect, useRef } from "react";
import { Button, Typography, Card, Layout, Modal, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { ListSheetsBySellerId } from "../../services/https";
import Sidebar from "../Component/Sidebar/Sidebar";
import Header from "../Component/Header/Header";
import AddSheet from "../AddSheet/AddSheet";
import "./MainSealSheet.css";
import { SheetInterface } from "../../Interface/Sheet";
import EditSealUser from "../EditSealUser/EditSealUser";
import EditSheet from "../EditSheet/EditSheet";

const { Content } = Layout;
const { Title, Text } = Typography;

const MainSealSheet: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [sheets, setSheets] = useState<SheetInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isAddSheetModalVisible, setAddSheetModalVisible] = useState(false);
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null);
  const [isEditSheetModalVisible, setEditSheetModalVisible] = useState(false);
  const sellerID = parseInt(localStorage.getItem("sellerId") || "0", 10);
  if (!sellerID) {
    console.error("SellerID not found in localStorage");
    setLoading(false); // ปิดสถานะการโหลด
    return;
  }

useEffect(() => {
  console.log("isEditSheetModalVisible:", isEditSheetModalVisible);
}, [isEditSheetModalVisible]);
  // ฟังก์ชันดึงข้อมูลชีท
  const fetchSheets = async () => {
    setLoading(true); // เริ่มสถานะการโหลด
    try {
      const response = await ListSheetsBySellerId(sellerID);
      if (response?.data) {
        setSheets(response.data);
      } else {
        console.error("Failed to fetch sheets");
      }
    } catch (error) {
      console.error("Error fetching sheets:", error);
    } finally {
      setLoading(false); // ปิดสถานะการโหลด
    }
  };
  // โหลดข้อมูลเมื่อเริ่มต้นหน้า
  useEffect(() => {
    fetchSheets();
  }, []);

  // วาด Canvas สำหรับชีทสรุป
  useEffect(() => {
    const radius = 10; // Radius for rounded corners
    canvasRefs.current.forEach((canvas, index) => {
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx && sheets[index]) {
          const sheet = sheets[index];

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Gradient Background
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, "#ff6b00"); // สีหลัก
          gradient.addColorStop(1, "#ffa000"); // สีส้มอ่อน
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
            
          // Border
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2;
          ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
                  // Course Code
          ctx.fillStyle = "#000";
          ctx.font = "bold 30px Arial";
          ctx.textAlign = "center";
          ctx.fillText(sheet.Course?.CourseCode|| "No Course Code", canvas.width / 2, 60);

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
          ctx.fillText(`ฉบับ ${sheet.Term?.Name || "N/A"} / ${sheet.Year || "N/A"}`, canvas.width / 2, 160);

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
    setAddSheetModalVisible(true);
  };

  return (
    <Layout className="mainseal">
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
      <Layout>
        <Header />
        <Content className="mainseaalsheet-content">
          <div className="buttonContainer">
            <Button
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
              onClick={() => setEditModalVisible(true)}
            >
              แก้ไข/ดู บัญชี
            </Button>
          </div>

          {/* Modal สำหรับเพิ่มชีท */}
          <Modal
            visible={isAddSheetModalVisible}
            onCancel={() => setAddSheetModalVisible(false)}
            footer={null} // ไม่ต้องการ footer
            width={700} // กำหนดความกว้าง
          >
            <AddSheet
              onClose={() => {
                setAddSheetModalVisible(false);
                fetchSheets(); // รีเฟรชข้อมูลเมื่อกดปุ่ม "บันทึก"
              }}
            />
          </Modal>
          <Modal
        visible={isEditSheetModalVisible && !!selectedSheetId}
        onCancel={() => {
          console.log("Closing modal..."); // Debug
          setEditSheetModalVisible(false); // ปิด Modal
          setSelectedSheetId(null); // รีเซ็ตค่า selectedSheetId
        }}
        footer={null}
        destroyOnClose
        width={700}
      >
        {isEditSheetModalVisible && selectedSheetId && (
          <EditSheet
            sheetId={selectedSheetId}
            visible={isEditSheetModalVisible}
            onClose={() => {
              console.log("Closing from EditSheet..."); // Debug
              setEditSheetModalVisible(false); // ปิด Modal
              setSelectedSheetId(null); // รีเซ็ตค่า selectedSheetId
              fetchSheets(); // รีเฟรชข้อมูล
            }}
          />
        )}
      </Modal>

          {/* Modal สำหรับแก้ไข/ดูบัญชี */}
          <EditSealUser
            visible={isEditModalVisible}
            onClose={() => {
              setEditModalVisible(false);
              fetchSheets(); // รีเฟรชข้อมูลเมื่อกดปุ่ม "บันทึก"
            }}
          />

          <Title level={4} className="footerTitle">
            ชีทสรุปที่เผยแพร่
          </Title>
          <Text className="footerNote">คลิกที่ชื่อชีทเพื่อแก้ไขข้อมูล</Text>
          <div className="MainSealSheet-list  ">
          {loading ? (
  <div className="fullscreen-loading">
    <Spin size="large" tip="กำลังโหลดข้อมูล..." />
  </div>
) : sheets.length > 0 ? (
              sheets.map((sheet, index) => (
                <Card
                  className="mainseaalsheet-card"
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
                  onClick={() => {
                    setSelectedSheetId(String(sheet.ID));
                    setEditSheetModalVisible(true);
                  }}
                                  
                >
                  <div className="purchased-mainseaalsheet-info">{`ซื้อไปแล้ว: ${
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