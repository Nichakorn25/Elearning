import { useState, useEffect } from "react";
import { Card, Layout, Button, Input, Form, message, Select, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Component/Sidebar/Sidebar";
import Header from "../Component/Header/Header";
import { ListBanks, GetSellerById, UpdateSellerById } from "../../services/https/index";
import "./EditSealUser.css";

const { Content } = Layout;
const { Option } = Select;

const EditSealUser = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const sellerId = localStorage.getItem("sellerId");
        if (!sellerId) {
          message.error("ไม่พบ ID ผู้ขายใน localStorage");
          navigate("/MainSealSheet");
          return;
        }
        const userID = localStorage.getItem("id");
        // ดึงข้อมูลธนาคาร
        const bankResponse = await ListBanks();
        if (bankResponse.status === 200 && bankResponse.data.data) {
          setBanks(bankResponse.data.data);
        } else {
          message.error("ไม่สามารถดึงข้อมูลธนาคารได้");
        }

        // ดึงข้อมูลผู้ขาย
        const sellerResponse = await GetSellerById(sellerId);
        if (sellerResponse.status === 200 && sellerResponse.data) {
          const sellerData = sellerResponse.data;
          form.setFieldsValue({
            username: sellerData.Name,
            bank: sellerData.SellerBankAccount[0]?.BankID,
            accountNumber: sellerData.SellerBankAccount[0]?.BankNumber,
          });
        } else {
          message.error("ไม่สามารถดึงข้อมูลผู้ขายได้");
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [form, navigate]);

  const handleUpdateUser = async () => {
    setSaving(true);
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
  
      const sellerId = localStorage.getItem("sellerId");
      const userID = localStorage.getItem("id"); // ดึง userID จาก localStorage
  
      if (!sellerId) {
        message.error("ไม่พบ ID ผู้ขายใน localStorage");
        setSaving(false);
        return;
      }
  
      if (!userID) {
        message.error("ไม่พบ UserID ใน localStorage");
        setSaving(false);
        return;
      }
  
      // สร้างข้อมูลที่จะอัปเดต
      const dataToSave = {
        Name: values.username,
        UserID: Number(userID), // รวม UserID ที่ดึงมาจาก localStorage
        SellerBankAccount: [
          {
            BankID: values.bank,
            BankNumber: values.accountNumber,
          },
        ],
      };
  
      console.log("Data to Update:", dataToSave);
  
      const response = await UpdateSellerById(sellerId, dataToSave);
      if (response.status === 200) {
        message.success("อัปเดตข้อมูลผู้ขายสำเร็จ");
        navigate("/dashboard");
      } else {
        message.error("เกิดข้อผิดพลาด: " + response.data.message);
      }
    } catch (errorInfo) {
      console.error("Failed:", errorInfo);
      message.error("ไม่สามารถบันทึกข้อมูลได้");
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <Layout className="editsealer">
      <Header />
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
      <Content className="editsealer-content">
        <Card className="form-container" title="แก้ไขข้อมูลผู้ขาย" bordered={false}>
          {loading ? (
            <Spin tip="กำลังโหลดข้อมูล..." />
          ) : (
            <Form form={form} layout="vertical" onFinish={handleUpdateUser}>
              <Form.Item
                label="ชื่อผู้ใช้"
                name="username"
                rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้" }]}
              >
                <Input placeholder="กรอกชื่อผู้ใช้" />
              </Form.Item>
              <Form.Item
                label="เลือกธนาคาร"
                name="bank"
                rules={[{ required: true, message: "กรุณาเลือกธนาคาร" }]}
              >
                <Select placeholder="เลือกธนาคาร">
                  {banks.map((bank: any) => (
                    <Option key={bank.ID} value={bank.ID}>
                      {bank.BankName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="เลขบัญชีธนาคาร"
                name="accountNumber"
                rules={[{ required: true, message: "กรุณากรอกเลขบัญชีธนาคาร" }]}
              >
                <Input placeholder="กรอกเลขบัญชีธนาคาร" />
              </Form.Item>
              <Form.Item className="form-button-item">
                <Button type="primary" htmlType="submit" loading={saving}>
                  บันทึกการเปลี่ยนแปลง
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      </Content>
    </Layout>
  );
};

export default EditSealUser;
