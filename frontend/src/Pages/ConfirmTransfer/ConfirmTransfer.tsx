import React, { useState } from 'react';
import Header from '../Component/Header/Header'; // Import the Header component
import Sidebar from '../Component/Sidebar/Sidebar'; // Import the Sidebar component
import './ConfirmTransfer.css'; // Assuming you have custom CSS for the page

const ConfirmTransfer: React.FC = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false); // Sidebar visibility state
  const [pendingTransfers, setPendingTransfers] = useState([
    { id: 1, buyer: 'John Doe', amount: 500 },
    { id: 2, buyer: 'Jane Smith', amount: 300 },
  ]);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible); // Toggle Sidebar visibility
  };

  const handleConfirm = (transferId: number) => {
    alert(`Transfer with ID ${transferId} confirmed!`);
    setPendingTransfers((prev) => prev.filter((transfer) => transfer.id !== transferId));
  };

  return (
    <div className="confirm-transfer-container">
      <Header /> {/* Include Header component */}
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} /> {/* Include Sidebar component */}

      {/* <h2 >Confirm Payment Transfer</h2> */}

      {/* Display pending transfers */}
      <div className="pending-transfers">
        <h2>Pending Transfers</h2>
        <ul>
          {pendingTransfers.map((transfer) => (
            <li key={transfer.id} className="transfer-item">
              <span>Buyer: {transfer.buyer}</span>
              <span>Amount: ${transfer.amount}</span>

              {/* Confirm button for admin */}
              <button
                onClick={() => handleConfirm(transfer.id)}
                className="confirm-button"
              >
                Confirm
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ConfirmTransfer;
