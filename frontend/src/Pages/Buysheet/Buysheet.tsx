import React, { useState, useRef, useEffect } from "react";
import { Card, Layout, Button, Badge, Input, Row, Col, message, Rate } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Component/Sidebar/Sidebar";
import Header from "../Component/Header/Header";
import { ListSheets,CreateCart,ListCarts, GetReviewsBySheetID } from "../../services/https"; 
import "./Buysheet.css";
import { SheetInterface } from "../../Interface/Sheet";

const { Meta } = Card;

const BuySheet: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [cartItemCount, setCartItemCount] = useState<number>(2);
  const [sheets, setSheets] = useState<SheetInterface[]>([]);
  const [filteredSheets, setFilteredSheets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchYear, setSearchYear] = useState<string>("");
  const [SearchCorseCode, setSearchCorseCode] = useState<string>("");
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  
  const fetchSheets = async () => {
    try {
      setLoading(true);
      const sheetResponse = await ListSheets();
      if (!sheetResponse?.data) {
        throw new Error("Failed to fetch sheets");
      }
      const sheetsData = sheetResponse.data;

      // ดึงคะแนนเฉลี่ยสำหรับแต่ละชีท
      const sheetsWithRatings = await Promise.all(
        sheetsData.map(async (sheet: any) => {
          try {
            const reviewResponse = await GetReviewsBySheetID(sheet.ID);
            const averageRating = reviewResponse?.average_rating || 0;
            return { ...sheet, average_rating: averageRating };
          } catch (error) {
            console.error(`Error fetching reviews for sheet ID ${sheet.id}:`, error);
            return { ...sheet, average_rating: 0 };
          }
        })
      );
      setSheets(sheetsWithRatings);
      setFilteredSheets(sheetsWithRatings);
    } catch (error) {
      console.error("Error fetching sheets:", error);
      message.error("ไม่สามารถโหลดข้อมูลชีทได้");
    } finally {
      setLoading(false);
    }
  };
  const fetchCartItemCount = async () => {
    const userID = localStorage.getItem("id");
  if (!userID) {
    console.error("User ID not found in localStorage.");
    message.error("กรุณาเข้าสู่ระบบ");
    navigate("/");
    return;
  }
    try {

        // Fetch cart list
        const cartListResponse = await ListCarts({ userId: parseInt(userID) });
        console.log("Cart List Response:", cartListResponse);

        if (!cartListResponse?.data) {
            console.error("Cart list data is empty or undefined.");
            throw new Error("Failed to fetch cart list");
        }

        // Find the active cart
        const activeCart = cartListResponse.data.find(
            (cart: { CartStatusID: number; UserID: number }) => 
                cart.CartStatusID === 1 && cart.UserID === parseInt(userID)
        );

        if (!activeCart) {
            console.warn("No active cart found for the user.");
            setCartItemCount(0);
            return;
        }

        console.log("Active Cart Details:", activeCart);
        // Calculate the item count in the active cart
        const itemCount = activeCart.CartItem?.length || 0;
        console.log("Item Count in Active Cart:", itemCount);
        setCartItemCount(itemCount);
    } catch (error) {
        console.error("Error fetching cart item count:", error);
        message.error("ไม่สามารถดึงจำนวนสินค้าในตะกร้าได้");
    }
 };
 const initializeCart = async () => {
  const userID = localStorage.getItem("id");
  if (!userID) {
    console.error("User ID not found in localStorage.");
    message.error("กรุณาเข้าสู่ระบบ");
    navigate("/");
    return;
  }
  try {
    // ตรวจสอบว่ามีตะกร้าสำหรับ userID และสถานะ Active อยู่หรือไม่
    const cartList = await ListCarts({ userId: parseInt(userID) });
    const hasActiveCart = cartList.data.some((cart: { cartStatusId: number; }) => cart.cartStatusId === 1);

    if (hasActiveCart) {
    } else {
      // ถ้าไม่มีตะกร้า Active ให้สร้างใหม่
      const result = await CreateCart({
        userId: parseInt(userID),
        cartStatusId: 1 // กำหนดสถานะ Active
      });

      if (result.isNewCartCreated) {
        setCartItemCount(0); 
      }
    }
  } catch (error) {
    console.error("Error initializing cart:", error);
    message.error("ไม่สามารถตรวจสอบหรือสร้างตะกร้าได้");
  }
};
const fetchData = async () => {
  setLoading(true);
  try {
    await initializeCart();
    await fetchCartItemCount();
    await fetchSheets();
  } catch (error) {
    console.error("Error fetching data:", error);
    message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchData();
}, []);

  

  useEffect(() => {
    const filtered = sheets.filter((sheet) => {
      // ตรวจสอบว่าค้นหาชื่อตรงกับ CourseDate (ชื่อวิชา)
      const matchesCourseCode = sheet.Course?.CourseCode?.toLowerCase().includes(SearchCorseCode.toLowerCase());
  
      // ตรวจสอบว่าปีตรงกับ searchYear
      const matchesYear = `${sheet.Year || ""}`.toLowerCase().includes(searchYear.toLowerCase());
  
      // ตรวจสอบว่าเทอมตรงกับ searchTermYear
      const matchesTerm = `${sheet.Term?.Name || ""}`.toLowerCase().includes(searchTerm.toLowerCase());
  
      // เงื่อนไข: ต้อง match อย่างน้อย 1 ฟิลด์
      return matchesCourseCode && matchesYear && matchesTerm;
    });
  
    setFilteredSheets(filtered);
  }, [SearchCorseCode, searchYear, searchTerm, sheets]);

  const navigateToSelectSheet = (sheetId: string | undefined) => {
    if (!sheetId) {
      message.error("Sheet ID is undefined.");
      return;
    }
    navigate(`/SelectSheet/${sheetId}`);
  };

useEffect(() => {
  // อัปเดตจำนวน canvasRefs ให้ตรงกับจำนวน filteredSheets
  canvasRefs.current = Array(filteredSheets.length)
    .fill(null)
    .map((_, index) => canvasRefs.current[index] || null);

  const radius = 10; // ความโค้งของมุม

 const drawCanvas = (ctx: CanvasRenderingContext2D, sheet: any, canvas: HTMLCanvasElement) => {
  // ล้าง canvas
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
  ctx.fillStyle = "#000"; // สีข้อความเป็นสีดำ
  ctx.font = "bold 30px Arial"; // ฟอนต์ ขนาด 30px Arial ตัวหนา
  ctx.textAlign = "center"; // จัดข้อความให้อยู่กึ่งกลาง
  ctx.fillText(sheet.Course?.CourseCode || "No Course Code", canvas.width / 2, 60);

  // Title
  ctx.fillStyle = "#000";
  ctx.font = "bold 20px Arial";
  ctx.strokeStyle = "#fff"; // สีขอบข้อความ (ขาว)
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
};


  // วาด canvas สำหรับ filteredSheets
  canvasRefs.current.forEach((canvas, index) => {
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx && filteredSheets[index]) {
        drawCanvas(ctx, filteredSheets[index], canvas);
      }
    }
  });
}, [filteredSheets]); // ให้ useEffect ทำงานใหม่เมื่อ filteredSheets เปลี่ยน


if (loading) {
  return (
  <div className="fullscreen-loading">
    <h2>กำลังโหลดข้อมูล...</h2>
    <div className="loader-circle"></div>
  </div>
  );
}
  return (
    <Layout className="sheet">
      <Header />
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
      {/* Sheet Overview */}
      <div className="buysheet-content">
              {/* Search Filters */}
              <div className="search-filters">
            <Row gutter={[16, 16]}>
              {/* ช่องค้นหาชื่อวิชา */}
              <Col span={8}>
                <Input
                  placeholder="ค้นหารหัส"
                  value={SearchCorseCode}
                  onChange={(e) => setSearchCorseCode(e.target.value)}
                  allowClear
                  size="large"
                />
              </Col>

              {/* ช่องค้นหาปี */}
              <Col span={8}>
                <Input
                  placeholder="ค้นหาปี"
                  value={searchYear}
                  onChange={(e) => setSearchYear(e.target.value)}
                  allowClear
                  size="large"
                />
              </Col>

              {/* ช่องค้นหาเทอม */}
              <Col span={8}>
                <Input
                  placeholder="ค้นหาเทอม"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  allowClear
                  size="large"
                />
              </Col>
            </Row>
          </div>
        <div className="Sheet-list">
          {filteredSheets.map((sheet, index) => (
            <Card
              key={index}
              style={{ width: 300, position: "relative" }}
              cover={
                <canvas
                  ref={(el) => {
                    canvasRefs.current[index] = el;
                  }}
                  width={300}
                  height={200}
                />
              }

              onClick={() => navigateToSelectSheet(sheet.ID || sheet.id)} 
            >
              <Meta title={sheet.Title} description={`Price: ${sheet.Price} BAHT`} />
              <div className="additional-info">
                {/* คะแนนเฉลี่ย */}
                <div className="average-rating">
                  <span>คะแนนเฉลี่ย:</span>{" "}
                  <Rate
                    disabled
                    allowHalf
                    value={sheet.average_rating || 0} // ใช้ค่า `average_rating` จาก API
                  />
                  <span>({sheet.average_rating?.toFixed(1) || "0"})</span>
                </div>
                {/* จำนวนคนซื้อ */}
                <div className="purchased-buysheet-info">
                  ซื้อไปแล้ว: {sheet.PurchaseCount || 0}
                </div>
                </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Shopping Cart Icon */}
      <div className="cart-icon" onClick={() => navigate("/cart")}>
        <Badge count={cartItemCount} overflowCount={99}>
          <Button
            shape="circle"
            icon={<ShoppingCartOutlined style={{ fontSize: "30px" }} />}
            size="large"
          />
        </Badge>
      </div>
    </Layout>
  );
};

export default BuySheet;