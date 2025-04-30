import React, { useEffect, useState, useRef } from "react";
import { message, Layout, Empty, Card } from "antd";
import { GetPurchasedFiles } from "../../services/https"; // Import ฟังก์ชันจาก service
import Header from "../Component/Header/Header";
import Sidebar from "../Component/Sidebar/Sidebar";
import "./PurchasedFiles.css"; // ไฟล์ CSS สำหรับสไตล์
import { useNavigate } from "react-router-dom";

const { Content } = Layout; 

const handleDownload = (fileURL: string) => {
    if (!fileURL) {
      message.error("ไม่พบ URL ของไฟล์");
      return;
    }
  
    // สร้าง URL สำหรับดาวน์โหลด
    const downloadUrl = `https://api.se-elearning.online${fileURL.split("/").pop()}`;
    window.open(downloadUrl, "_blank"); 
  };
  

const PurchasedFiles: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]); // สำหรับเก็บข้อมูลไฟล์
  const [loading, setLoading] = useState(false); // สำหรับสถานะการโหลด
  const [isSidebarVisible, setSidebarVisible] = useState(false); // สำหรับควบคุม Sidebar
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const navigate = useNavigate();
  const userID = localStorage.getItem("id");
  if (!userID) {
    console.error("User ID not found in localStorage.");
    message.error("กรุณาเข้าสู่ระบบ");
    navigate("/");
    return;
  }

  useEffect(() => {
    const fetchPurchasedFiles = async () => {
      try {
        setLoading(true);
        const response = await GetPurchasedFiles(parseInt(userID));
        console.log("Response from API:", response); 
        if (response?.data?.length > 0) {
          setFiles(response.data);
        }
      } catch (error: any) {
        console.error("Error fetching purchased files:", error);
        message.error("ไม่สามารถโหลดข้อมูลไฟล์ที่ซื้อสำเร็จได้");
      } finally {
        setLoading(false);
      }
    };

    if (userID) {
      fetchPurchasedFiles();
    } else {
      message.error("กรุณาเข้าสู่ระบบ");
    }
  }, [userID]);

  useEffect(() => { 
  
    const drawCanvas = (ctx: CanvasRenderingContext2D, file: any, canvas: HTMLCanvasElement) => {
     
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
      ctx.fillText(file.CourseCode || "No Course Code", canvas.width / 2, 50);
  
      // Title
      ctx.fillStyle = "#000";
      ctx.font = "bold 20px Arial";
      ctx.fillText(file.title || "No Title", canvas.width / 2, 90);
  
      // Seller Name
      ctx.fillStyle = "red";
      ctx.font = "16px Arial";
      ctx.fillText(`By ${file.sellerName || "No Seller"}`, canvas.width / 2, 130);
  
      // Edition
      ctx.fillStyle = "#000";
      ctx.font = "16px Arial";
      ctx.fillText(`ฉบับ: ${file.year || "N/A"} / ${file.term || "N/A"}`, canvas.width / 2, 165);
    };
  
    canvasRefs.current.forEach((canvas, index) => {
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx && files[index]) {
          drawCanvas(ctx, files[index], canvas);
        }
      }
    });
  }, [files]);
  
  

  if (loading) {
    return (
    <div className="fullscreen-loading">
      <h2>กำลังโหลดข้อมูล...</h2>
      <div className="loader-circle"></div>
    </div>
    );
  }
  return (
    <Layout className="purchased-files-layout">
      <Header />
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
      <Content className="purchased-files-content">
        <h2>ชีทของฉัน</h2>
        {files.length > 0 ? (
          <div className="purchased-files-list">
            {files.map((file, index) => (
                <Card
                className="purchased-files-list-card"
                key={file.id}
                cover={
                    <canvas
                    ref={(el) => {
                        canvasRefs.current[index] = el;
                    }}
                    width={300}
                    height={200}
                    className="purchased-files-list-card-cover"
                    />
                }
                hoverable
                onClick={() => handleDownload(file.fileURL)} // เพิ่ม onClick สำหรับ Card
                >
                <Card.Meta
                    description={
                    <>
                        <p>
                        <strong>ฉบับ:</strong> {file.year}/{file.term}
                        </p>
                        <p>
                        <strong>ผู้ขาย:</strong> {file.sellerName}
                        </p>
                    </>
                    }
                />
                </Card>

            ))}
          </div>
        ) : (
          <Empty description="ไม่มีชีทที่ซื้อ" className="empty-container" />
        )}
      </Content>
    </Layout>
  );
  
};

export default PurchasedFiles;