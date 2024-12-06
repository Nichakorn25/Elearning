import React, { useState, useRef, useEffect } from 'react';
import { Cascader, Card, Layout, Button, Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
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
  const courses = [
    { courseName: "Mathematics", chapterName: "Algebra Basics", purchasedCount: 12 },
    { courseName: "Physics", chapterName: "Newton's Laws", purchasedCount: 8 },
    { courseName: "Biology", chapterName: "Cell Structure", purchasedCount: 15 },
    { courseName: "Chemistry", chapterName: "Periodic Table", purchasedCount: 5 },
    { courseName: "History", chapterName: "World War II", purchasedCount: 7 },
  ];
  

  // Create a ref for managing canvas elements
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

useEffect(() => {
  canvasRefs.current.forEach((canvas, index) => {
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'orange';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#ffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

        ctx.fillStyle = '#ffff';
        ctx.font = '24px Arial Bold';
        ctx.textAlign = 'center';
        ctx.fillText(courses[index].courseName, canvas.width / 2, 60);

        ctx.strokeStyle = '#ffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(20, 80);
        ctx.lineTo(canvas.width - 20, 80);
        ctx.stroke();

        ctx.fillStyle = '#ffff';
        ctx.font = '18px Arial';
        ctx.fillText(courses[index].chapterName, canvas.width / 2, 120);
        
      }
    }
  });
}, []);

  
  const onChange: CascaderProps<Option>['onChange'] = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

  const filter = (inputValue: string, path: DefaultOptionType[]) =>
    path.some(
      (option) =>
        (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
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
    navigate('/'); // Go to the main page
  };

  const goToProfile = () => {
    closeDropdown();
    navigate('/profile'); // Go to the profile page
  };

  const goToBuySheet = () => {
    closeDropdown();
    navigate('/Buysheet'); // Go to BuySheet page
  };

  const handleMouseEnter = (id: string) => {
    setHoveredCard(id);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  const goToSelectSheet = () => {
    navigate('/selectsheet');
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
        {courses.map((course, index) => (
            <Card
              key={index}
              style={{ width: 300, position: 'relative' }}
              cover={
                <canvas
                  ref={(el) => {
                    canvasRefs.current[index] = el;
                  }}
                  width={300}
                  height={200}
                />
              }
              onMouseEnter={() => handleMouseEnter(course.courseName)}
              onMouseLeave={handleMouseLeave}
              onClick={goToSelectSheet}
              className={hoveredCard === course.courseName ? 'hovered' : ''}
            >
              <Meta title={course.courseName} description={`Chapter: ${course.chapterName}`} />
              {/* เพิ่มจำนวนการซื้อ */}
              <div className="purchased-info">{`ซื้อไปแล้ว: ${course.purchasedCount}`}</div>
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
