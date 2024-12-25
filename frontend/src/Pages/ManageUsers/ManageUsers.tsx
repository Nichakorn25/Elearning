import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import Sidebar from "../Component/Sidebar/Sidebar";
import Header from "../Component/Header/Header";
import { ListUsers, DeleteUserByID, UpdateUserByid } from "../../services/https"; // Import API functions
import "./ManageUsers.css";

interface User {
  id: number;
  username: string;
  fullname: string;
  email: string;
  department: string;
  role: string;
  status: string;
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await ListUsers(); // Fetch users from API
        const fetchedUsers = response.data; // Extract the users data from the response
  
        if (fetchedUsers && Array.isArray(fetchedUsers)) {
          // Map the fetched data to the format that your component expects
          const usersData = fetchedUsers.map((user: any) => ({
            id: user.ID, // Map 'ID' to 'id'
            username: user.Username,
            fullname: user.Fullname, // Ensure you have a 'Fullname' field in the response
            email: user.Email, // Ensure you have an 'Email' field in the response
            department: user.Department, // Ensure you have a 'Department' field in the response
            role: user.Role, // Ensure you have a 'Role' field in the response
            status: user.Status, // Ensure you have a 'Status' field in the response
          }));
          setUsers(usersData); // Update state with formatted data
        } else {
          message.error("Failed to load users.");
        }
      } catch (error) {
        console.error("Error fetching users:", error); // Log errors for debugging
        message.error("An error occurred while fetching users.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, []); // Fetch users when component mounts
  

  const handleDelete = async (id: number) => {
    try {
      const isDeleted = await DeleteUserByID(id);
      if (isDeleted) {
        message.success("User deleted successfully.");
        setUsers(users.filter(user => user.id !== id)); // Update the list after deletion
      } else {
        message.error("Failed to delete the user.");
      }
    } catch (error) {
      message.error("An error occurred while deleting the user.");
    }
  };

  const handleUpdate = async (id: string, data: User) => {
    try {
      const response = await UpdateUserByid(id, data); // Use the UpdateUserByid API function
      if (response) {
        message.success("User updated successfully.");
        // Optionally, you can refetch users or update the local state
      } else {
        message.error("Failed to update the user.");
      }
    } catch (error) {
      message.error("An error occurred while updating the user.");
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
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: User) => (
        <div className="action-buttons">
          <Button
            type="primary"
            onClick={() => handleUpdate(record.id.toString(), { ...record, status: 'Active' })}
            disabled={record.status === "Active"}
          >
            Activate
          </Button>
          <Button
            type="default"
            danger
            onClick={() => handleUpdate(record.id.toString(), { ...record, status: 'Inactive' })}
            disabled={record.status === "Inactive"}
          >
            Deactivate
          </Button>
          <Button
            type="default"
            danger
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header />
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
      <div className="manage-users-container">
        <h2>Manage Users</h2>
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          loading={loading}
          bordered
        />
      </div>
    </div>
  );
};

export default ManageUsers;
