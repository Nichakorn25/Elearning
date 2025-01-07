import { useState, useEffect } from "react";
import { Card, Layout, Button, Input, Form, message, Select, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Component/Sidebar/Sidebar";
import Header from "../Component/Header/Header";
import { ListBanks } from "../../services/https/index";
import { CreateSeller } from "../../services/https/index";
import "./AddSealUser.css";

const { Content } = Layout;
const { Option } = Select;

const AddSealUser = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch bank data from service
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await ListBanks();
        console.log("Banks API Response:", response.data); // ตรวจสอบโครงสร้างข้อมูล
        if (response.status === 200 && response.data.data) {
          setBanks(response.data.data); // ใช้ `response.data.data` แทน `response.data`
        } else {
          message.error("ไม่สามารถดึงข้อมูลธนาคารได้");
        }
      } catch (error) {
        console.error("Error fetching banks:", error);
        message.error("ข้อผิดพลาดในการเชื่อมต่อ API");
      } finally {
        setLoading(false);
      }
    };
    fetchBanks();
  }, []);

  const handleCreateUser = async () => {
    setSaving(true);
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
  
      // ดึง UserID จาก localStorage
      const userID = localStorage.getItem("id");
      if (!userID) {
        message.error("ไม่พบ UserID ใน localStorage");
        setSaving(false);
        return;
      }
  
      // สร้างข้อมูลตามโครงสร้าง API
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
  
      console.log("Data to Save:", dataToSave); // ตรวจสอบข้อมูลก่อนส่ง
  
      // ส่งข้อมูลไปยัง API
      const response = await CreateSeller(dataToSave);
      if (response.status === 201) {
        message.success("ผู้ใช้ถูกสร้างเรียบร้อยแล้ว!");
        navigate("/MainSealSheet");
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
    <Layout className="addsealer">
      <Header />
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
      <Content className="addsealer-content">
        <Card className="form-container" title="สร้างผู้ใช้ใหม่" bordered={false}>
          {loading ? (
            <Spin tip="กำลังโหลดข้อมูล..." />
          ) : (
            <Form form={form} layout="vertical" onFinish={handleCreateUser}>
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
                  สร้างผู้ใช้
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      </Content>
    </Layout>
  );
};

export default AddSealUser;
