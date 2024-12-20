import { useState, useEffect } from 'react';
import { Table, Card, Layout, Typography } from 'antd';
import './IncomeHistory.css';
import Sidebar from '../Component/Sidebar/Sidebar';
import Header from '../Component/Header/Header';

const { Content } = Layout;
const { Title } = Typography;

const IncomeHistory = () => {
  const [incomeData, setIncomeData] = useState([]);
    const [isSidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    // Placeholder for fetching income data
    const fetchData = async () => {
      const response = await fetch('/api/income-history'); // Adjust API endpoint as needed
      const data = await response.json();
      setIncomeData(data);
    };
    fetchData();
  }, []);

  const columns = [
    {
      title: 'วันที่',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'รายละเอียด',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'จำนวนเงิน',
      dataIndex: 'amount',
      key: 'amount',
    },
  ];

  return (
    <Layout className="site-layout">
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
      <Layout>
        <Header />
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <Card bordered={false} className="income-history-card">
            <Title level={2}>ประวัติรายได้</Title>
            <Table columns={columns} dataSource={incomeData} rowKey="id" />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default IncomeHistory;
