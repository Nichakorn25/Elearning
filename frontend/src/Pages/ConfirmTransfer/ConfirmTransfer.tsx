import React, { useState, useEffect } from 'react';
import { Table, Button, Tabs, message, Popconfirm, Modal } from 'antd';
import Header from '../Component/Header/Header';
import Sidebar from '../Component/Sidebar/Sidebar';
import { GetTransactionLog, UpdateTransactionLog } from "../../services/https";
import './ConfirmTransfer.css';

const ConfirmTransfer: React.FC = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [pendingTransfers, setPendingTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlip, setSelectedSlip] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingTransfers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await GetTransactionLog();
        console.log("response data", response.data);
        if (response && response.data) {
          setPendingTransfers(response.data);
        } else {
          setError('No transaction data available');
        }
      } catch (err) {
        setError('Failed to load pending transfers');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingTransfers();
  }, []);

  // ในฟังก์ชัน handleConfirm
const handleConfirm = async (transactionId: number) => {
  try {
    await UpdateTransactionLog(transactionId.toString(), 2);  // ส่ง StatusID เป็นค่าตัวเลข 2
    message.success(`Transfer confirmed successfully!`);
    setPendingTransfers((prev) =>
      prev.map((transfer) =>
        transfer.ID === transactionId ? { ...transfer, StatusID: 2 } : transfer
      )
    );
  } catch (err) {
    message.error('Failed to confirm transfer');
  }
};


  const columns = [
    {
      title: 'Buyer',
      dataIndex: ['Payment', 'User', 'Username'],
      key: 'buyer',
    },
    {
      title: 'Amount',
      dataIndex: ['Payment', 'Amount'],
      key: 'amount',
      render: (amount: number) => `$${amount}`,
    },
    {
      title: 'Payment Date',
      dataIndex: ['Payment', 'PaymentDate'],
      key: 'PaymentDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Slip',
      dataIndex: ['Payment', 'Slip'],
      key: 'Slip',
      render: (Slip: string) => (
        <>
          <a onClick={() => setSelectedSlip(Slip)} style={{ cursor: 'pointer', color: '#1890ff' }}>
            View Slip
          </a>
          <Modal
            title="Slip Preview"
            visible={!!selectedSlip}
            footer={null}
            onCancel={() => setSelectedSlip(null)}
            centered // ทำให้ Modal อยู่ตรงกลางหน้าจอ
            bodyStyle={{ padding: 0 }} // ลบ padding ใน Modal
          >
            <div
              style={{
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <img
                src={selectedSlip || ''}
                alt="Slip"
                style={{
                  maxWidth: '100%', // กำหนดความกว้างสูงสุดไม่เกิน 90% ของ Modal
                  maxHeight: '60vh', // จำกัดความสูงไม่เกิน 80% ของหน้าจอ
                  width: 'auto', // รักษาอัตราส่วน
                  height: 'auto', // รักษาอัตราส่วน
                  display: 'block', // ป้องกัน spacing
                }}
              />
            </div>
          </Modal>

                  </>
      ),
    },
    {
      title: 'User ID',
      dataIndex: ['Payment', 'UserID'],
      key: 'UserID',
    },
    {
      title: 'Purchase ID',
      dataIndex: ['Payment', 'PurchaseID'],
      key: 'PurchaseID',
    },
    {
      title: 'Method ID',
      dataIndex: ['Payment', 'MethodID'],
      key: 'MethodID',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        record.StatusID === 1 ? (
          <Popconfirm
            title="Are you sure to confirm this transfer?"
            onConfirm={() => handleConfirm(record.ID)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary">Confirm</Button>
          </Popconfirm>
        ) : (
          <span>Completed</span>
        )
      ),
    },
  ];

  return (
    <div className="confirm-transfer-container">
      <Header />
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />

      <div className="pending-transfers">
        <h2>Pending Transfers</h2>

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: 'All',
              children: (
                <Table
                  dataSource={pendingTransfers}
                  columns={columns}
                  rowKey="ID"
                  loading={loading}
                  bordered
                />
              ),
            },
            {
              key: '2',
              label: 'Pending',
              children: (
                <Table
                  dataSource={pendingTransfers.filter((transfer) => transfer.StatusID === 1)}
                  columns={columns}
                  rowKey="ID"
                  loading={loading}
                  bordered
                />
              ),
            },
            {
              key: '3',
              label: 'Completed',
              children: (
                <Table
                  dataSource={pendingTransfers.filter((transfer) => transfer.StatusID === 2)}
                  columns={columns}
                  rowKey="ID"
                  loading={loading}
                  bordered
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ConfirmTransfer;