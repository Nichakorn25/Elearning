import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import Sidebar from "../Component/Sidebar/Sidebar";
import Header from "../Component/Header/Header";
import "./ManageRoleRequests.css";

interface RoleRequest {
  id: number;
  username: string;
  fullname: string;
  email: string;
  department: string;
  reason: string;
  status: string; // e.g., "Pending", "Approved", "Rejected"
}

const ManageRoleRequests: React.FC = () => {
  const [requests, setRequests] = useState<RoleRequest[]>([]);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    let isMounted = true;  // Flag to track if component is mounted
    const fetchRoleRequests = async () => {
      console.log("Fetching role requests...");
      setLoading(true);
      try {
        const response = await fetch("/api/role-requests");
        const data = await response.json();
        if (isMounted) {
          setRequests(data);  // Only update state if component is mounted
        }
      } catch (error) {
        if (isMounted) {
          message.error("Failed to load role requests.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRoleRequests();

    // Cleanup function to mark component as unmounted
    return () => {
      isMounted = false;
    };
  }, []);  // Empty dependency array ensures the effect runs only once

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`/api/role-requests/${id}/approve`, {
        method: "POST",
      });
      if (response.ok) {
        message.success("Role request approved.");
        fetchRoleRequests(); // Refresh the table
      } else {
        message.error("Failed to approve the request.");
      }
    } catch (error) {
      message.error("An error occurred.");
    }
  };

  const handleReject = async (id: number) => {
    try {
      const response = await fetch(`/api/role-requests/${id}/reject`, {
        method: "POST",
      });
      if (response.ok) {
        message.success("Role request rejected.");
        fetchRoleRequests(); // Refresh the table
      } else {
        message.error("Failed to reject the request.");
      }
    } catch (error) {
      message.error("An error occurred.");
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Fullname",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: RoleRequest) => (
        <div className="action-buttons">
          <Button
            type="primary"
            onClick={() => handleApprove(record.id)}
            disabled={record.status !== "Pending"}
          >
            Approve
          </Button>
          <Button
            type="default"
            danger
            onClick={() => handleReject(record.id)}
            disabled={record.status !== "Pending"}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header />
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
      <div className="manage-role-requests-container">
        <h2>Manage Role Change Requests</h2>
        <Table
          dataSource={requests}
          columns={columns}
          rowKey="id"
          loading={loading}
          bordered
        />
      </div>
    </div>
  );
};

export default ManageRoleRequests;
