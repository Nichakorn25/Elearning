import React, { useState, useEffect, useRef } from "react";
import { Card, Layout, Button, Spin, message, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import Header from "../Component/Header/Header";
import { CartItemInterface } from "../../Interface/CartItem";
import { DeleteCartItemById, GetCartByUser } from "../../services/https";
import Sidebar from "../Component/Sidebar/Sidebar";
import "./Cart.css";

const { Meta } = Card;

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItemInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  const fetchCartItems = async () => {
    const userId = localStorage.getItem("id");
    if (!userId) {
      message.error("กรุณาเข้าสู่ระบบก่อนใช้งาน");
      navigate("/");
      return;
    }
  
    try {
      setLoading(true);
      const response = await GetCartByUser(userId);
      if (response?.data?.ID) {
        localStorage.setItem("cartId", response.data.ID); // บันทึก Cart ID
      }
      console.log("Response Data:", response.data.CartItem); // Debug Data
      if (!response || !response.data || response.data.CartStatusID !== 1) {
        message.info("ไม่มีตะกร้าที่ใช้งานอยู่");
        setCartItems([]);
        return;
      }
  
      setCartItems(response.data.CartItem || []);
    } catch (error) {
      message.error("ไม่สามารถดึงข้อมูลสินค้าในตะกร้าได้");
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCartItems();
  }, []);
  useEffect(() => {
    console.log("Cart Items:", cartItems);
    cartItems.forEach((item, index) => {
        const canvas = canvasRefs.current[index];
        if (canvas && item.Sheet) {
            console.log("Canvas Data:", item.Sheet); // Debug data
        }
    });
}, [cartItems]);
useEffect(() => {
  console.log("Cart Items:", cartItems);
  cartItems.forEach((item, index) => {
      const canvas = canvasRefs.current[index];
      if (canvas && item.Sheet) {
          console.log("Canvas Data:", item.Sheet); // Debug data
      }
  });
}, [cartItems]);

const handleRemoveItem = async (itemId: number | undefined) => {
  if (!itemId) {
    message.error("ไม่สามารถลบสินค้าได้ เนื่องจาก ID ไม่ถูกต้อง");
    return;
  }

  try {
    await DeleteCartItemById(itemId); // ใช้ itemId ที่ตรวจสอบแล้ว
    setCartItems((prevItems) => prevItems.filter((item) => item.ID !== itemId));
    message.success("ลบสินค้าออกจากตะกร้าเรียบร้อยแล้ว");
    fetchCartItems();
  } catch (error) {
    message.error("ไม่สามารถลบสินค้าได้");
    console.error("Error removing item:", error);
  }
};
const handlePayment = () => {
  const cartId = localStorage.getItem("cartId");
  if (!cartId) {
    message.error("ไม่พบ Cart ID ในระบบ โปรดตรวจสอบอีกครั้ง");
    return;
  }
  if (cartItems.length === 0) {
    message.error("ไม่มีสินค้าในตะกร้า โปรดเพิ่มสินค้าก่อนทำการชำระเงิน");
    return;
  }
  navigate("/Payment", { state: { cartId, cartItems } });
};



  useEffect(() => {
    const radius = 10; // Radius for rounded corners
    canvasRefs.current.forEach((canvas, index) => {
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx && cartItems[index]) {
          const cartItem = cartItems[index];

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
          ctx.fillText(cartItem.Sheet?.Course?.CourseCode || "No Course Code", canvas.width / 2, 60);

          // Title
          ctx.fillStyle = "#000";
          ctx.font = "bold 20px Arial";
          ctx.fillText(cartItem.Sheet?.Title || "No Title", canvas.width / 2, 100);

          // Seller Name
          ctx.fillStyle = "red";
          ctx.font = "16px Arial";
          ctx.fillText(`By ${cartItem.Sheet?.Seller?.Name || "No Seller"}`, canvas.width / 2, 130);

          // Edition
          ctx.fillStyle = "#000";
          ctx.font = "16px Arial";
          ctx.fillText(`ฉบับ ${cartItem.Sheet?.Term?.Name || "N/A"} / ${cartItem.Sheet?.Year || "N/A"}`, canvas.width / 2, 160);

          // Price (Rounded Button)
          const price = `${cartItem.Sheet?.Price || "0"} BAHT`;
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
  },[cartItems]);

  if (loading) {
    return (
      <Layout className="Cart">
        <Header />
        <Spin size="large" tip="กำลังโหลด..." style={{ margin: "auto", display: "block", marginTop: "20%" }} />
      </Layout>
    );
  }
  return (
<Layout className="Cart">
<Sidebar isVisible={false} onClose={function (): void {
        throw new Error("Function not implemented.");
      } }/>
  <Header />
  <div className="Cart-Content">
    <h2 className="Cart-Title">ตะกร้าสินค้า</h2>
    {cartItems.length === 0 ? (
  <div className="Empty-Container">
    <Empty
      description={
        <span className="Empty-Description">
          ไม่มีสินค้าในตะกร้าของคุณ
        </span>
      }
    >
      <button
        className="Empty-Button"
        onClick={() => navigate("/Buysheet")}
      >
        ไปเลือกสินค้ากัน!
      </button>
    </Empty>
  </div>
)  : (
      <div className="CartSheet-list">
        {cartItems.map((item, index) => (
          <Card
            key={item.ID}
            hoverable
            className="CartCard"
            cover={
              <canvas
                ref={(el) => {
                  canvasRefs.current[index] = el;
                }}
                width={300}
                height={200}
              />
            }
            actions={[
          <Button
            className="remove-button"
            type="link"
            onClick={() => handleRemoveItem(item.ID!)}
          >
            ลบสินค้า
          </Button>
            ]}
          >
            <Meta
              title={<span className="CartCard-Title">{item.Sheet?.Title || "No Title"}</span>}
              description={
                <div>
                  <p className="CartCard-Price">ราคา: {item.Sheet?.Price || "0"} บาท</p>
                  <p className="CartCard-Seller">ผู้ขาย: {item.Sheet?.Seller?.Name || "ไม่ระบุ"}</p>
                </div>
              }
            />
          </Card>
        ))}
      </div>
    )}
  </div>
  {cartItems.length > 0 && (
    <div className="CartFooter">
      <Button
        size="large"
        className="Button-Checkout"
        onClick={handlePayment}
      >
        ชำระเงิน
      </Button>
    </div>
  )}
</Layout>

  );  

};

export default Cart;