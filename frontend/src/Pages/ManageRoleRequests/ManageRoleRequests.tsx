import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Tabs, Popconfirm } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import Header from '../Component/Header/Header';
import Sidebar from '../Component/Sidebar/Sidebar';
import './ManageRoleRequests.css';
import { GetRoleChangeRequests, UpdateRoleChangeRequestsById, UpdateUserRoleByID } from '../../services/https';
import { ChangeRoleInterface, RoleRequest } from '../../Interface/Admin';

const ManageRoleRequests: React.FC = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [requests, setRequests] = useState<ChangeRoleInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentIdCard, setCurrentIdCard] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const fetchRoleRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await GetRoleChangeRequests();
      console.log(res);
      if (res.data && Array.isArray(res.data.data)) {
        setRequests(res.data.data);
      } else {
        setError('No role change requests available');
      }
    } catch (error) {
      setError('Failed to load role change requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleRequests();
  }, []);

  const handleApprove = async (ID: number, userID: number) => {
    try {
      await UpdateRoleChangeRequestsById(ID.toString(), { status: 'Approved' });
      await UpdateUserRoleByID(userID, { role_id: 2 });
      message.success('Role request approved and user role updated successfully.');
      fetchRoleRequests();
    } catch (error) {
      message.error('Failed to approve role request.');
    }
  };

  const handleReject = async (ID: number) => {
    try {
      await UpdateRoleChangeRequestsById(ID.toString(), { status: 'Rejected' });
      message.success('Role request rejected.');
      fetchRoleRequests();
    } catch (error) {
      message.error('Failed to reject role request.');
    }
  };

  const showIdCard = (idCardUrl: string) => {
    setCurrentIdCard(`http://localhost:8000${idCardUrl}`);
    setModalVisible(true);
  };

  const handleCancelModal = () => {
    setModalVisible(false);
    setCurrentIdCard(null);
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: ['User', 'Username'],
      key: 'username',
    },
    {
      title: 'Fullname',
      dataIndex: ['User', 'FirstName'],
      key: 'fullname',
    },
    {
      title: 'Email',
      dataIndex: ['User', 'Email'],
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: ['User', 'Phone'],
      key: 'phone',
    },
    {
      title: 'Department',
      dataIndex: ['User', 'Department', 'DepartmentName'],
      key: 'department',
    },
    {
      title: 'Major',
      dataIndex: ['User', 'Major', 'MajorName'],
      key: 'major',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'ID Card',
      key: 'idCard',
      render: (record: ChangeRoleInterface) =>
        record.idCard ? (
          <Button icon={<EyeOutlined />} type="link" onClick={() => showIdCard(record.idCard)}>
            View
          </Button>
        ) : (
          <span>No ID Card</span>
        ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: ChangeRoleInterface) =>
        record.status === 'Pending' ? (
          <div className="action-buttons">
            <Popconfirm
              title="Are you sure to approve this request?"
              onConfirm={() => handleApprove(record.ID, record.User.ID)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary">Approve</Button>
            </Popconfirm>
            <Popconfirm
              title="Are you sure to reject this request?"
              onConfirm={() => handleReject(record.ID)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="default" danger>
                Reject
              </Button>
            </Popconfirm>
          </div>
        ) : (
          <span>{record.status}</span>
        ),
    },
  ];

  return (
    <div className="manage-role-requests-container">
      <Header />
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
      <div className="pending-requests">
        <h2>Manage Role Change Requests</h2>

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        <Tabs defaultActiveKey="all" onChange={() => {}}>
          <Tabs.TabPane tab="All" key="all">
            <Table dataSource={requests} columns={columns} rowKey="ID" bordered />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Pending" key="pending">
            <Table dataSource={requests.filter((r) => r.status === 'Pending')} columns={columns} rowKey="ID" bordered />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Approved" key="approved">
            <Table dataSource={requests.filter((r) => r.status === 'Approved')} columns={columns} rowKey="ID" bordered />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Rejected" key="rejected">
            <Table dataSource={requests.filter((r) => r.status === 'Rejected')} columns={columns} rowKey="ID" bordered />
          </Tabs.TabPane>
        </Tabs>

        <Modal
          visible={isModalVisible}
          title="ID Card"
          onCancel={handleCancelModal}
          footer={null}
          width={600}
        >
          {currentIdCard ? (
            <img
              src={currentIdCard}
              alt="ID Card"
              style={{ width: '100%', objectFit: 'contain' }}
            />
          ) : (
            <p>No ID card available</p>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ManageRoleRequests;
