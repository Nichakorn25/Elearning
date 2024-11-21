import React, { useState, useEffect, useRef } from 'react';
import { Card, Layout, Button, Badge } from 'antd';
import { useNavigate } from 'react-router-dom';
import './cart.css';

const { Meta } = Card;

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const goToDashboard = () => navigate('/dashboard');
  const handleLogout = () => navigate('/');
  const goToProfile = () => navigate('/profile');
  const goToBuySheet = () => navigate('/Buysheet');

  const sampleCartItems = [
    {
      id: '1',
      name: 'Introduction to Mathematics',
      description: 'A beginner-friendly mathematics guide.',
      price: 350,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      name: 'Physics Fundamentals',
      description: 'Learn the basics of physics concepts.',
      price: 450,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '3',
      name: 'Biology Insights',
      description: 'Explore the world of biology.',
      price: 300,
      image: 'https://via.placeholder.com/150',
    },
  ];

  const totalPrice = sampleCartItems.reduce((sum, item) => sum + item.price, 0);

  const CartItem: React.FC<{ item: typeof sampleCartItems[0]; onRemove: () => void; onClick: () => void }> = ({ item, onRemove, onClick }) => (
    <Card hoverable cover={<img alt={item.name} src={item.image} />} onClick={onClick}>
      <Meta title={item.name} description={item.description} />
      <p>Price: {item.price} THB</p>
      <Button type="primary" onClick={(e) => {
          e.stopPropagation(); // ป้องกันการเรียก onClick ที่การ์ด
          onRemove();
        }}>
        Remove
      </Button>
    </Card>
  );

  const goToSelectSheet = () => {
    navigate('/selectsheet'); // เมื่อคลิกการ์ด จะนำทางไปหน้าที่กำหนด
  };

  return (
    <Layout className="sheet">
      {/* Header Section */}
      <header className="sheet-header">
        <div className="header-left">
          <button className="menu-button" aria-label="Toggle menu">☰</button>
          <h1>SUT e-Learning</h1>
          <span className="language">English (en)</span>
        </div>
        <div className="header-right">
          <div className="user-info" onClick={toggleDropdown}>
            <span className="user-id">B6525972</span>
            <span className="user-name">ณิชากร จันทร์ยุทา</span>
            <img src="https://via.placeholder.com/40" alt="User Avatar" className="user-avatar" />
          </div>

          {isDropdownVisible && (
            <div ref={dropdownRef} className="dropdown-menu">
              <button onClick={goToDashboard}>Dashboard</button>
              <button onClick={goToProfile}>Profile</button>
              <button onClick={goToBuySheet}>BuySheet</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>

      {/* Cart Section */}
      <div className="Cart-Overview">
        <h2>Cart</h2>
        <div className="Sheet-list">
          {sampleCartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onClick={goToSelectSheet}
              onRemove={() => console.log(`Remove ${item.name} from cart`)}
            />
          ))}
        </div>
        <div className="cart-total">
          <h3>Total Price: {totalPrice} THB</h3>
          <Button type="primary">Checkout</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
