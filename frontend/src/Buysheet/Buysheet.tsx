import React, { useState } from 'react';
import { Cascader, Card, Layout, Button, Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons'; // ใช้ไอคอนจาก Ant Design
import { useNavigate } from 'react-router-dom';
import type { CascaderProps, GetProp } from 'antd';
import './buysheet.css';

type DefaultOptionType = GetProp<CascaderProps, 'options'>[number];
interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

const BuySheet: React.FC = () => {
  const navigate = useNavigate();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null); 
  const [cartItemCount, setCartItemCount] = useState<number>(2);
  const { Meta } = Card;

  const options1: Option[] = [
    { value: 'Math', label: 'Mathematics' },
    { value: 'Phys', label: 'Physics' },
  ];

  const options2: Option[] = [
    { value: 'Bio', label: 'Biology' },
    { value: 'Chem', label: 'Chemistry' },
  ];

  const options3: Option[] = [
    { value: 'Hist', label: 'History' },
    { value: 'Geo', label: 'Geography' },
  ];

  const options4: Option[] = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
  ];

  const onChange: CascaderProps<Option>['onChange'] = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

  const filter = (inputValue: string, path: DefaultOptionType[]) =>
    path.some(
      (option) => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
    );

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

  const handleMouseEnter = (id: string) => {
    setHoveredCard(id); // เมื่อเมาส์วางจะตั้งค่า id ของการ์ดที่ถูกวาง
  };

  const handleMouseLeave = () => {
    setHoveredCard(null); // เมื่อเมาส์ออกจากการ์ดให้รีเซ็ตสถานะ
  };

  const goToSelectSheet = () => {
    navigate('/selectsheet'); // เมื่อคลิกการ์ด จะนำทางไปหน้าที่กำหนด
  };

  const goToCart = () => {
    navigate('/cart');
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
          <div className="user-info" onClick={toggleDropdown}>
            <span className="user-id">B6525972</span>
            <span className="user-name">ณิชากร จันทร์ยุทา</span>
            <img
              src="https://via.placeholder.com/40"
              alt="User Avatar"
              className="user-avatar"
            />
          </div>

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

      {/* Search Bar */}
      <div className="search-bar">
        <Cascader
          className="cascader-major"
          options={options1}
          onChange={onChange}
          placeholder="Select Major"
          showSearch={{ filter }}
        />
        <Cascader
          className="cascader-course"
          options={options2}
          onChange={onChange}
          placeholder="Select Course"
          showSearch={{ filter }}
        />
        <Cascader
          className="cascader-teacher"
          options={options3}
          onChange={onChange}
          placeholder="Select TeacherName"
          showSearch={{ filter }}
        />
        <Cascader
          className="cascader-term"
          options={options4}
          onChange={onChange}
          placeholder="Select Term"
          showSearch={{ filter }}
        />
      </div>

      {/* Sheet Overview */}
      <div className="Sheet-overview">
        <h2>Sheet</h2>
        <div className="Sheet-list">
          {['1', '2', '3', '4', '5'].map((cardId) => (
            <Card
              key={cardId}
              style={{ width: 300 }}
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              onMouseEnter={() => handleMouseEnter(cardId)}
              onMouseLeave={handleMouseLeave}
              onClick={goToSelectSheet}
              className={hoveredCard === cardId ? 'hovered' : ''}
            >
              <Meta
                title="Course Name"
                description="This is the description"
              />
            </Card>
          ))}
        </div>
      </div>

      {/* Shopping Cart Icon */}
    <div className="cart-icon" onClick={goToCart}>
      <Badge count={cartItemCount} overflowCount={99}>
        <Button
          shape="circle"
          icon={<ShoppingCartOutlined style={{ fontSize: '30px' }} />}
          size="large"
        />
      </Badge>
    </div>
    </Layout>
  );
};

export default BuySheet;
