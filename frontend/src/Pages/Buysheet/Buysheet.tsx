import React, { useState, useRef, useEffect } from "react";
import { Card, Layout, Button, Badge, Spin, Input, Row, Col, message, Rate } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Component/Sidebar/Sidebar";
import Header from "../Component/Header/Header";
import { ListSheets,CreateCart,ListCarts, GetReviewsBySheetID } from "../../services/https"; // ใช้ฟังก์ชัน API
import "./buysheet.css";

const { Meta } = Card;

const BuySheet: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [cartItemCount, setCartItemCount] = useState<number>(2);
  const [sheets, setSheets] = useState<any[]>([]);
  const [filteredSheets, setFilteredSheets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchTermYearTerm, setSearchTermYearTerm] = useState<string>("");
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const userID = localStorage.getItem("id");
  if (!userID) {
    console.error("User ID not found in localStorage.");
    message.error("กรุณาเข้าสู่ระบบ");
    navigate("/");
    return;
  }
  useEffect(() => {
    const fetchCartItemCount = async () => {
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

    fetchCartItemCount();
}, [navigate]);

  
  useEffect(() => {
    const fetchSheets = async () => {
      try {
        setLoading(true);

        // ดึงข้อมูลชีททั้งหมด
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

    fetchSheets();
  }, []);
  
  useEffect(() => {
    const initializeCart = async () => {
      try {
        // ตรวจสอบว่ามีตะกร้าสำหรับ userID และสถานะ Active อยู่หรือไม่
        const cartList = await ListCarts({ userId: parseInt(userID) });
        const hasActiveCart = cartList.data.some((cart: { cartStatusId: number; }) => cart.cartStatusId === 1);
  
        if (hasActiveCart) {
          message.info("ใช้ตะกร้าเดิมที่มีอยู่แล้ว");
        } else {
          // ถ้าไม่มีตะกร้า Active ให้สร้างใหม่
          const result = await CreateCart({
            userId: parseInt(userID),
            cartStatusId: 1 // กำหนดสถานะ Active
          });
  
          if (result.isNewCartCreated) {
            setCartItemCount(0); 
            message.success("สร้างตะกร้าใหม่สำเร็จ");
          }
        }
      } catch (error) {
        console.error("Error initializing cart:", error);
        message.error("ไม่สามารถตรวจสอบหรือสร้างตะกร้าได้");
      }
    };
    initializeCart();
  }, [navigate]);
  

  useEffect(() => {
    const filtered = sheets.filter((sheet) => {
      const matchesTitle = sheet.Title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYearTerm = `${sheet.Year || ""}/${sheet.Term || ""}`
        .toLowerCase()
        .includes(searchTermYearTerm.toLowerCase());
      return matchesTitle && matchesYearTerm;
    });
    setFilteredSheets(filtered);
  }, [searchTerm, searchTermYearTerm, sheets]);


  const navigateToSelectSheet = (sheetId: string | undefined) => {
    if (!sheetId) {
      message.error("Sheet ID is undefined.");
      return;
    }
    navigate(`/SelectSheet/${sheetId}`);
  };

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
  }, [filteredSheets]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spin tip="กำลังโหลดข้อมูล..." size="large" />
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
          <Col span={12}>
            <Input
              placeholder="ค้นหาชื่อวิชา"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              size="large"
            />
          </Col>
          <Col span={12}>
            <Input
              placeholder="ค้นหาปี/เทอม"
              value={searchTermYearTerm}
              onChange={(e) => setSearchTermYearTerm(e.target.value)}
              allowClear
              size="large"
            />
          </Col>
        </Row>
      </div>
        <h2>Sheet</h2>
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
              className={hoveredCard === (sheet.ID || sheet.id) ? "hovered" : ""}
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
                <div className="purchased-info">
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
