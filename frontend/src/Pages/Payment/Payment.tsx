import { useState, useEffect } from "react";
import { Layout, Table, Button, Upload, message, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { GetCartById, CheckoutCart } from "../../services/https";
import Header from "../Component/Header/Header";
import Sidebar from "../Component/Sidebar/Sidebar";
import "./Payment.css";

const { Content } = Layout;

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cartId = location.state?.cartId;
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<any[]>([]);
  const bankDetails = {
    name: "ธนาคารกรุงเทพ",
    accountName: "นายชำระเงิน",
    accountNumber: "123-456-789",
  };

  useEffect(() => {
    if (!cartId) {
      message.error("ไม่พบข้อมูลตะกร้า");
      navigate("/cart");
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await GetCartById(cartId);
        if (response) {
          const items = response.data.CartItem.map((item: any) => ({
            id: item.ID,
            title: item.Sheet?.Title || "ไม่มีชื่อชีท",
            price: item.Sheet?.Price || 0,
          }));
          setCartItems(items);

          const calculatedTotal = items.reduce((sum: number, item: any) => sum + item.price, 0);
          setTotal(calculatedTotal);
        } else {
          message.error("ไม่สามารถโหลดข้อมูลตะกร้าได้");
        }
      } catch (error) {
        message.error("เกิดข้อผิดพลาดในการโหลดข้อมูลตะกร้า");
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [cartId, navigate]);

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (file: File) => {
    try {
      const fileObj = {
        uid: `${Date.now()}`, // Unique ID for the file
        name: file.name,
        status: "done",
        url: URL.createObjectURL(file), // Temporary URL for preview
        originFileObj: file,
      };
      setUploadedFile([fileObj]); // แทนที่ไฟล์เก่าด้วยไฟล์ใหม่
      message.success("อัพโหลดสลิปการชำระเงินสำเร็จ");
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการอัพโหลดไฟล์");
      console.error("Error during file upload:", error);
    }
  };

  const handleSubmitPayment = async () => {
    if (!cartId || !uploadedFile.length) {
      message.error("กรุณาอัพโหลดสลิปการชำระเงินก่อนยืนยัน");
      return;
    }

    try {
      const base64Slip = await getBase64(uploadedFile[0].originFileObj);

      const userId = localStorage.getItem("id");
      if (!userId) {
        message.error("กรุณาเข้าสู่ระบบก่อนทำรายการ");
        return;
      }

      const paymentData = {
        PaymentDate: new Date(),
        Amount: total,
        Slip: base64Slip,
        UserID: parseInt(userId, 10),
        PurchaseID: parseInt(cartId, 10),
        CartID: parseInt(cartId, 10),
        MethodID: 1,
      };

      const response = await CheckoutCart(paymentData);

      if (response) {
        message.success("ยืนยันการชำระเงินสำเร็จ");
        navigate("/Buysheet");
      } else {
        message.error("การชำระเงินล้มเหลว");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการชำระเงิน");
      console.error("Error during checkout:", error);
    }
  };

  return (
    <Layout className="site-layout">
      <Sidebar
        isVisible={false}
        onClose={() => {
          console.log("Sidebar closed");
        }}
      />
      <Header />
      <Layout>
        <Content className="site-content">
          <Card className="card" title="ชำระเงิน" bordered={false}>
            <Table
              dataSource={cartItems}
              columns={[
                { title: "ชื่อชีท", dataIndex: "title", key: "title" },
                { title: "ราคา", dataIndex: "price", key: "price" },
              ]}
              pagination={false}
            />
            <div className="total-container">
              <div>รวม:</div>
              <div>{total} บาท</div>
            </div>
            <div className="bank-details">
              <div>
                <strong>ธนาคาร:</strong> {bankDetails.name}
              </div>
              <div>
                <strong>ชื่อบัญชี:</strong> {bankDetails.accountName}
              </div>
              <div>
                <strong>เลขบัญชี:</strong> {bankDetails.accountNumber}
              </div>
            </div>
            <div className="upload-container">
              <Upload
                beforeUpload={(file) => {
                  if (!file.type.startsWith("image/")) {
                    message.error("อนุญาตให้อัพโหลดเฉพาะไฟล์รูปภาพเท่านั้น");
                    return Upload.LIST_IGNORE;
                  }
                  handleFileUpload(file);
                  return false; // Prevent automatic upload
                }}
                fileList={uploadedFile} // ใช้ fileList ที่จัดการได้
                maxCount={1} // จำกัดการอัปโหลด 1 ไฟล์
                accept="image/*" // อนุญาตเฉพาะรูปภาพ
              >
                <Button icon={<UploadOutlined />}>อัพโหลดสลิปการชำระเงิน</Button>
              </Upload>
            </div>
            <div className="confirm-payment">
              <Button
                type="primary"
                size="large"
                onClick={handleSubmitPayment}
                disabled={!uploadedFile.length} // Disable ถ้าไม่มีไฟล์
              >
                ยืนยันการชำระเงิน
              </Button>
            </div>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Payment;
