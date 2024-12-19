import React, { useState } from 'react';
import { Layout, Table, Input, Button, Upload, message, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './Payment.css';
import Sidebar from '../Component/Sidebar/Sidebar';
import Header from '../Component/Header/Header';

const { Content } = Layout;

const PaymentPage = () => {
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [cartItems, setCartItems] = useState([
        { key: '1', title: 'คณิตศาสตร์', price: 200 },
        { key: '2', title: 'วิทยาศาสตร์', price: 250 }
    ]);
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    const bankDetails = {
        name: "ธนาคารกรุงเทพ",
        accountName: "นายชำระเงิน",
        accountNumber: "123-456-789"
    };

    const columns = [
        { title: 'ชื่อชีท', dataIndex: 'title', key: 'title' },
        { title: 'ราคา', dataIndex: 'price', key: 'price' }
    ];

    const handleFileUpload = (info) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} อัพโหลดสำเร็จ`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} อัพโหลดล้มเหลว`);
        }
    };

    return (
        <Layout className="site-layout">
            <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
            <Layout className="site-layout">
    <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
    <Layout>
        <Header />
        <Content>
            <Card className="card" title="ชำระเงิน" bordered={false}>
                <Table dataSource={cartItems} columns={columns} pagination={false} />
                <div className="total-container">
                    <div>Total:</div>
                    <div>{total} บาท</div>
                </div>
                <div className="bank-details">
                    <div><strong>ธนาคาร:</strong> {bankDetails.name}</div>
                    <div><strong>ชื่อบัญชี:</strong> {bankDetails.accountName}</div>
                    <div><strong>เลขบัญชี:</strong> {bankDetails.accountNumber}</div>
                </div>
                <div className="upload-container">
                    <Upload onChange={handleFileUpload} action="/upload-path">
                        <Button icon={<UploadOutlined />}>อัพโหลดสลิปการชำระเงิน</Button>
                    </Upload>
                </div>
                <div className="button-container">
                    <Button type="primary">ยืนยันการชำระเงิน</Button>
                </div>
            </Card>
        </Content>
    </Layout>
</Layout>

        </Layout>
    );
};

export default PaymentPage;
