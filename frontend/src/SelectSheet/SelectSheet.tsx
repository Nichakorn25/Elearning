import React, { useState } from 'react';
import { Card, Button, Row, Col, Layout, Input, List, Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './SelectSheet.css';

const { Content } = Layout;
const { TextArea } = Input;

const SelectSheet: React.FC = () => {
    const navigate = useNavigate();
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [comments, setComments] = useState<string[]>([]);
    const [commentInput, setCommentInput] = useState('');

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
        navigate('/');
    };

    const goToProfile = () => {
        closeDropdown();
        navigate('/profile');
    };

    const goToBuySheet = () => {
        closeDropdown();
        navigate('/Buysheet');
    };

    const handleAddComment = () => {
        if (!commentInput.trim()) {
            message.warning('Please enter a valid comment.');
            return;
        }

        setComments([...comments, commentInput]);
        setCommentInput('');
        message.success('Comment added successfully!');
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
                                        {/* Comment Section */}
                                        <Card title="Comments" className="comments-card" style={{ marginTop: '20px' }}>
                            <Form layout="vertical" onFinish={handleAddComment}>
                                <Form.Item label="Comment">
                                    <TextArea
                                        rows={4}
                                        value={commentInput}
                                        onChange={(e) => setCommentInput(e.target.value)}
                                        placeholder="Write your comment here..."
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" onClick={handleAddComment}>
                                        Comment
                                    </Button>
                                </Form.Item>
                            </Form>

                            {/* Display Comments */}
                            <List
                                bordered
                                dataSource={comments}
                                renderItem={(comment, index) => (
                                    <List.Item key={index}>{comment}</List.Item>
                                )}
                                locale={{ emptyText: 'No comments yet. Be the first to comment!' }}
                            />
                        </Card>
            </Content>
        </Layout>
    );
};

export default SelectSheet;
