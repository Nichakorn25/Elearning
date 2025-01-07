import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import Header from '../Component/Header/Header'; // Import the Header component
import Sidebar from '../Component/Sidebar/Sidebar'; // Import the Sidebar component
import './ConfirmTransfer.css'; // Assuming you have custom CSS for the page

const ConfirmTransfer: React.FC = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false); // Sidebar visibility state
  const [pendingTransfers, setPendingTransfers] = useState<any[]>([]); // State to store pending transfers
  const [loading, setLoading] = useState<boolean>(false); // Loading state for fetching data
  const [error, setError] = useState<string | null>(null); // Error state to store any errors

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible); // Toggle Sidebar visibility
  };

  // Simulate fetching pending transfers (mock data)
  useEffect(() => {
    const fetchPendingTransfers = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        // Simulating an API call with mock data
        const mockData = [
          { id: 1, buyer: 'John Doe', amount: 500 },
          { id: 2, buyer: 'Jane Smith', amount: 300 },
          { id: 3, buyer: 'Alice Johnson', amount: 750 },
        ];
        setPendingTransfers(mockData); // Set the mock data as the pending transfers
      } catch (err) {
        setError('Failed to load pending transfers');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingTransfers(); // Fetch mock data when component mounts
  }, []); // Empty dependency array means this runs once on component mount

  const handleConfirm = (transferId: number) => {
    alert(`Transfer with ID ${transferId} confirmed!`);
    setPendingTransfers((prev) => prev.filter((transfer) => transfer.id !== transferId));
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Buyer',
      dataIndex: 'buyer',
      key: 'buyer',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `$${amount}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Button
          onClick={() => handleConfirm(record.id)}
          type="primary"
        >
          Confirm
        </Button>
      ),
    },
  ];

  return (
    <div className="confirm-transfer-container">
      <Header /> {/* Include Header component */}
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} /> {/* Include Sidebar component */}

      <div className="pending-transfers">
        <h2>Pending Transfers</h2>

        {/* Show loading or error */}
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        {/* Display the table with pending transfers */}
        <Table
          dataSource={pendingTransfers}
          columns={columns}
          rowKey="id"
          loading={loading}
          bordered
        />
      </div>
    </div>
  );
};

export default ConfirmTransfer;
