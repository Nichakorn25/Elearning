import { useState, useEffect } from "react";
import { Layout, Table, Button, Upload, message, Card, Row, Col, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { GetCartById, CheckoutCart, checkSlip, GetAllPaymentMethods } from "../../services/https";
import PromptPay from "../../assets/PromptPay.png";
import GSBIcon from "../../assets/GSBIcon.png";
import SCBIcon from "../../assets/SCBIcon.jpg";
import KTBIcon from "../../assets/KTBIcon.png";
import PromptPayIcon from "../../assets/PromptPayIcon.png";
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
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); 
  const [checkingSlip, setCheckingSlip] = useState(false); 
  const userId = localStorage.getItem("id");
  if (!userId) {
    console.error("User ID not found in localStorage.");
    message.error("กรุณาเข้าสู่ระบบ");
    navigate("/");
    return;
  }


  const getPaymentDetails = (methodId: number) => {
    return paymentMethods.find((method: any) => method.ID === methodId);
  };

  // แมปชื่อธนาคารกับไอคอน
  const iconMapping: Record<string, string> = {
    "ออมสิน": GSBIcon,
    "ไทยพาณิชย์": SCBIcon,
    "กรุงไทย": KTBIcon,
  };

  useEffect(() => {
    if (!cartId) {
      message.error("ไม่พบข้อมูลตะกร้า");
      navigate("/cart");
      return;
    }

    const fetchPaymentMethods = async () => {
      setLoading(true);
      try {
        const response = await GetAllPaymentMethods();
        if (response?.payment_methods) {
          const methodsWithIcons = response.payment_methods.map((method: any) => {
            // กรณี type เป็น "qr" ใช้ PromptPay
            if (method.type === "qr") {
              return { ...method, icon: PromptPayIcon };
            }

            return {
              ...method,
              icon: iconMapping[method.name] || "", // ใส่ไอคอนจากการแมปชื่อ หรือค่าว่าง
            };
          });
          setPaymentMethods(methodsWithIcons);
        } else {
          message.error("ไม่สามารถโหลดข้อมูลวิธีการชำระเงินได้");
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
        message.error("เกิดข้อผิดพลาดในการโหลดข้อมูลวิธีการชำระเงิน");
      } finally {
        setLoading(false);
      }
    };

    const fetchCart = async () => {
      setLoading(true);
      try {
        const response = await GetCartById(cartId);
        if (response) {
          const items = response.data.CartItem.map((item: any) => ({
            id: item.ID,
            title: item.Sheet?.Title || "ไม่มีชื่อชีท",
            price: item.Sheet?.Price || 0,
          }));
          setCartItems(items);

          const calculatedTotal = items.reduce(
            (sum: number, item: any) => sum + item.price,
            0
          );
          setTotal(calculatedTotal);
        } else {
          message.error("ไม่สามารถโหลดข้อมูลตะกร้าได้");
        }
      } catch (error) {
        message.error("เกิดข้อผิดพลาดในการโหลดข้อมูลตะกร้า");
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
    fetchCart();
  }, [cartId, navigate]);
  const toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  

  const handleFileUpload = async (file: File) => {
    try {
      const fileObj = {
        uid: `${Date.now()}`,
        name: file.name,
        status: "done",
        url: URL.createObjectURL(file),
        originFileObj: file,
      };
      setUploadedFile([fileObj]);
      message.success("อัพโหลดสลิปการชำระเงินสำเร็จ");
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการอัพโหลดไฟล์");
      console.error("Error during file upload:", error);
    }
  };

  const handleSubmitPayment = async () => {
    if (!cartId || !uploadedFile.length || !selectedMethod) {
      message.error("กรุณาเลือกวิธีการชำระเงินและอัพโหลดสลิปก่อนยืนยัน");
      return;
    }
    setCheckingSlip(true);
  
    try {
      const file = uploadedFile[0].originFileObj;
  
      // แปลงไฟล์เป็น Base64 สำหรับบันทึกในฐานข้อมูล
      const base64Slip = (await toBase64(file)) as string;
  
 
  
      const formData = new FormData();
      formData.append("amount", total.toString());
      formData.append("files", file); // ใช้ URL ชั่วคราวสำหรับตรวจสอบ
      formData.append("log", "true");
  
      const slipResponse = await checkSlip(formData);
  
      if (!slipResponse.success) {
        // ใช้ข้อความจาก API โดยตรง
        message.error(`ตรวจสอบสลิปล้มเหลว: ${slipResponse.message}`);
        return;
      }
  
      const slipData = slipResponse.data;
  
      // ตรวจสอบข้อมูลในสลิป
      if (slipData.amount !== total) {
        message.error("ยอดเงินในสลิปไม่ตรงกับยอดเงินที่ต้องชำระ");
        return;
      }
  
      const selectedBank = paymentMethods.find((m) => m.ID === selectedMethod);
      if (slipData.receivingBank !== selectedBank.bank_code) {
        message.error("ธนาคารผู้รับเงินในสลิปไม่ตรงกับธนาคารที่เลือก");
        return;
      }
      const accountName = selectedBank.account_name;
      const accountFirstName = accountName.split(" ")[0];

      const receiverName = slipData.receiver.displayName;
      if (!receiverName.includes(accountFirstName)) {
        message.error("ชื่อผู้รับเงินในสลิปไม่ตรงกับชื่อบัญชีที่เลือก");
        return;
      }
  
      // ส่งข้อมูลการชำระเงินในฐานข้อมูล
      const paymentData = {
        PaymentDate: new Date(),
        Amount: total,
        Slip: base64Slip, // ใช้ Base64 สำหรับบันทึกในฐานข้อมูล
        UserID: parseInt(userId),
        PurchaseID: parseInt(cartId),
        CartID: parseInt(cartId),
        MethodID: selectedMethod,
      };
  
      const response = await CheckoutCart(paymentData);
  
      if (response) {
        message.success("ยืนยันการชำระเงินสำเร็จ");
        navigate("/Buysheet");
      } else {
        message.error("การชำระเงินล้มเหลว");
      }
    } catch (error) {
      if (error instanceof Error) {
        // กรณีที่ error เป็น instance ของ Error
        message.error(`${error.message}`);
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        const apiError = error as { response: { data?: { message?: string } } };
        const errorMessage =
          apiError.response.data?.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
        message.error(`ตรวจสอบสลิปล้มเหลว: ${errorMessage}`);
      } else {
        // กรณีที่ไม่สามารถระบุชนิดของ error ได้
        message.error('เกิดข้อผิดพลาดที่ไม่สามารถระบุได้');
      }
    }
    finally {
      setCheckingSlip(false); // จบตรวจสอบสลิป
    }
  };
  if (loading || checkingSlip) {
    return (
      <div className="fullscreen-loading">
        <h2>{loading ? "กำลังโหลดข้อมูล..." : "กำลังตรวจสอบสลิป..."}</h2>
        <div className="loader-circle"></div>
      </div>
    );
  }
  

  return (
    <Layout className="site-layout">
      <Sidebar isVisible={false} onClose={function (): void {
        throw new Error("Function not implemented.");
      } } />
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
            <div className="payment-methods">
              <Row gutter={[16, 16]} justify="center">
                {paymentMethods.map((method: any) => (
                  <Col key={method.ID} xs={12} sm={8} md={6} lg={4}>
                    <Card
                      hoverable
                      className={`payment-icon ${
                        selectedMethod === method.ID ? "selected-icon" : ""
                      }`}
                      onClick={() => setSelectedMethod(method.ID)}
                    >
                      <div className="icon-container">
                        <Image src={method.icon} preview={false} width={50} alt={method.name} />
                      </div>
                      <h4>{method.name}</h4>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
            {selectedMethod && (
              <div className="payment-details">
                {getPaymentDetails(selectedMethod)?.type === "qr" && (
                  <div className="details-container">
                    <Image
                      src={PromptPay}
                      alt="QR Code"
                      width={200}
                    />
                  </div>
                )}
                {getPaymentDetails(selectedMethod)?.type === "bank" && (
                  <div className="details-container">
                    <p>
                      <strong>เลขบัญชี:</strong>{" "}
                      {getPaymentDetails(selectedMethod)?.account}
                    </p>
                    <p>
                      <strong>ชื่อบัญชี:</strong>{" "}
                      {getPaymentDetails(selectedMethod)?.account_name}
                    </p>
                  </div>
                )}
              </div>
            )}
            <div className="upload-container">
              <Upload
                beforeUpload={(file) => {
                  if (!file.type.startsWith("image/")) {
                    message.error("อนุญาตให้อัพโหลดเฉพาะไฟล์รูปภาพเท่านั้น");
                    return Upload.LIST_IGNORE;
                  }
                  handleFileUpload(file);
                  return false;
                }}
                fileList={uploadedFile}
                maxCount={1}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>อัพโหลดสลิปการชำระเงิน</Button>
              </Upload>
            </div>
            <div className="confirm-payment">
              <Button
              className="confirm-payment-bottom"
                size="large"
                onClick={handleSubmitPayment}
                disabled={!uploadedFile.length || !selectedMethod}
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