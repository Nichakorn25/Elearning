import  { useState, useEffect } from "react";
import { Table, Card, Layout, Typography, message } from "antd";
import Sidebar from "../Component/Sidebar/Sidebar";
import Header from "../Component/Header/Header";
import { getIncomeHistoryBySellerID } from "../../services/https"; // Import service
import "./IncomeHistory.css";

const { Content } = Layout;
const { Title } = Typography;

const IncomeHistory = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const sellerID = parseInt(localStorage.getItem("sellerId") || "0", 10); // ดึง SellerID จาก localStorage

  useEffect(() => {
    const fetchIncomeData = async () => {
      setLoading(true);
      try {
        const data = await getIncomeHistoryBySellerID(sellerID);
        setIncomeData(data.data); // ใช้ข้อมูลที่ดึงมา
      } catch (error) {
        message.error("ไม่สามารถโหลดข้อมูลประวัติรายได้ได้");
      } finally {
        setLoading(false);
      }
    };

    if (sellerID) {
      fetchIncomeData();
    } else {
      message.error("กรุณาเข้าสู่ระบบ");
    }
  }, [sellerID]);

  const columns = [
    {
      title: "วันที่",
      dataIndex: "date",
      key: "date",
      align: "center" as "center", 
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "ชื่อชีท",
      dataIndex: "title",
      key: "title",
      align: "center" as "center", 
      render: (title: string) => <span title={title}>{title}</span>,
    },
    {
      title: "จำนวนเงิน",
      dataIndex: "amount",
      key: "amount",
      align: "center" as "center", 
      render: (amount: number) => `${amount.toLocaleString()} บาท`,
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      align: "center" as "center", 
      render: (status: string) => {
        const statusClass = status === "Pending" ? "status-yellow" : "status-green";
        return <span className={statusClass}>{status}</span>;
      },
    },
  ];
  
  // ตั้งค่า locale หากไม่มีข้อมูล
  const tableLocale = {
    emptyText: "ไม่มีข้อมูลรายได้",
  };
  
  
  if (loading) {
    return (
    <div className="fullscreen-loading">
      <h2>กำลังโหลดข้อมูล...</h2>
      <div className="loader-circle"></div>
    </div>
    );
  }
  return (
    <Layout className="site-layout">
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
      <Layout>
        <Header />
        <Content className="ant-layout-content">
          <Card bordered={false} className="income-history-card">
            <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
              ประวัติรายได้
            </Title>
            <Table
              columns={columns}
              dataSource={incomeData}
              rowKey="id"
              locale={tableLocale}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
  
};

export default IncomeHistory;