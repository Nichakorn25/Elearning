import React, { useState, useEffect, useRef } from 'react';
import { Card, Layout, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './cart.css';
import Sidebar from '../Component/Sidebar/Sidebar';
import Header from '../Component/Header/Header';

const { Meta } = Card;

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
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
          e.stopPropagation();
          onRemove();
        }}>
        Remove
      </Button>
    </Card>
  );

  const goToSelectSheet = () => {
    navigate('/selectsheet');
  };

  return (
    <Layout className="sheet">
      <Header />
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
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
          <Button 
            type="primary" 
            onClick={() => navigate('/payment')}
          >
            Checkout
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
