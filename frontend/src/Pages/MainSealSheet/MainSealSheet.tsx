import { useState, useEffect } from "react";
import { Button, Typography, Card, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import "./MainSealSheet.css";
import Sidebar from '../../Component/Sidebar/Sidebar';
import Header from '../../Component/Header/Header';

const { Content } = Layout;
const { Title, Text } = Typography;

const MainSealSheet = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  
  useEffect(() => {
    // Placeholder for an API call
  }, []);

  const handleNewSheetClick = () => {
    // Function to handle when the 'Add New Sheet' button is clicked
    navigate("/AddSheet");
  };

  const handleEditSealUserClick = () => {
    // Function to handle when the 'Edit Details' button is clicked
    navigate("/EditSealUser");
  };

  return (
    <Layout className="sheet">
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
      <Layout>
        <Header />
        <Content className="mainseaalsheet-content">
          <div className="buttonContainer">
            <Button type="primary" className="greenButton" onClick={handleNewSheetClick}>
              เพิ่มชีทสรุปวันใหม่
            </Button>
            <Button className="yellowButton" onClick={() => navigate("/IncomeHistory")}>
              ประวัติรายได้
            </Button>
            <Button className="yellowButton" onClick={handleEditSealUserClick}>
              แก้ไข/ดู ที่อยู่, บัญชี
            </Button>
          </div>
          <Title level={4} className="footerTitle">ชีทสรุปที่เผยแพร่</Title>
          <Text className="footerNote">คลิกที่ชื่อชีทเพื่อแก้ไขข้อมูล</Text>
          <div className="sheetList">
            <Card title="ชีทคณิตศาสตร์" hoverable className="card" onClick={() => navigate("/EditSheet")}>
              <p>รายละเอียดชีทคณิตศาสตร์</p>
            </Card>
            <Card title="ชีทวิทยาศาสตร์" hoverable className="card" onClick={() => navigate("/EditSheet")}>
              <p>รายละเอียดชีทวิทยาศาสตร์</p>
            </Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainSealSheet;
