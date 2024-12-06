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

const SealSheet: React.FC = () => {
  const navigate = useNavigate();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [cartItemCount, setCartItemCount] = useState<number>(2);
  const { Meta } = Card;


  
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
    <Layout className="add-user">

    </Layout>
  );
};

export default SealSheet;
