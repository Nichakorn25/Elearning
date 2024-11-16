import React, { useState } from 'react';
import { Card, Button, Row, Col, Layout, Dropdown, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import './SelectSheet.css';

const { Header, Content } = Layout;

const SelectSheet: React.FC = () => {
    const navigate = useNavigate();
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const sheetDetails = {
        name: "Example Sheet",
        price: "99 THB",
        description: "This is a sample sheet description.",
        coverImage: "https://via.placeholder.com/200",
    };

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
      };
    
      const closeDropdown = () => {
        setDropdownVisible(false);
      };
    
      const goToDashboard = () => {
        closeDropdown();
        navigate('/dashboard');
      };
    
      const handleLogout = () => {
        console.log('Logging out...');
        closeDropdown();
        navigate('/'); // เปลี่ยนเส้นทางไปหน้าแรก
      };
    
      const goToProfile = () => {
        closeDropdown();
        navigate('/profile'); // เปลี่ยนเส้นทางไปหน้าโปรไฟล์
      };
    
      const goToBuySheet = () => {
        closeDropdown();
        navigate('/Buysheet'); // เปลี่ยนเส้นทางไปหน้าโปรไฟล์
      };


    return (
        <Layout className="sheet">
            {/* Header Section */}
            <header className="sheet-header">
        <div className="header-left">
          <button className="menu-button">☰</button>
          <h1>SUT e-Learning</h1>
          <span className="language">English (en)</span>
        </div>
        <div className="header-right">
          {/* คลิก User ID, Name หรือ Avatar เพื่อเปิด dropdown */}
          <div className="user-info" onClick={toggleDropdown}>
            <span className="user-id">B6525972</span>
            <span className="user-name">ณิชากร จันทร์ยุทา</span>
            <img
              src="https://via.placeholder.com/40"
              alt="User Avatar"
              className="user-avatar"
            />
          </div>

          {/* Dropdown */}
          {isDropdownVisible && (
            <div className="dropdown-menu">
              <button onClick={goToDashboard}>Dashboard</button>
              <button onClick={goToProfile}>Profile</button>
              <button onClick={goToBuySheet}>BuySheet</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>
            {/* Main Content */}
            <Content className="sheet-content">
                <Row gutter={[16, 16]} justify="center" align="middle">
                    <Col xs={24} md={8}>
                        <Card
                            cover={<img alt="Sheet Cover" src={sheetDetails.coverImage} />}
                            className="sheet-card"
                        />  
                    </Col>
                    <Col xs={24} md={16}>
                        <Card title="Sheet Details" bordered={false} className="sheet-details-card">
                            <p><strong>Name:</strong> {sheetDetails.name}</p>
                            <p><strong>Price:</strong> {sheetDetails.price}</p>
                            <p><strong>Description:</strong> {sheetDetails.description}</p>
                            <Button type="primary" onClick={() => navigate('/Buysheet')}>Buy</Button>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default SelectSheet;
