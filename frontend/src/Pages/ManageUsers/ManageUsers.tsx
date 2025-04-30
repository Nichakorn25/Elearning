import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, Input } from "antd";
import Sidebar from "../Component/Sidebar/Sidebar";
import Header from "../Component/Header/Header";
import { ListUsers, DeleteUserByID, UpdateUserByid } from "../../services/https"; // Import API functions
//import { UserInterface } from '../../Interface/IUser';
import "./ManageUsers.css";

const { Search } = Input;

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
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // State สำหรับเก็บข้อมูลที่กรองแล้ว
  const [searchText, setSearchText] = useState<string>(""); // State สำหรับเก็บข้อความค้นหา
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const loggedInUserId = localStorage.getItem("id");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await ListUsers();
      const fetchedUsers = response.data;
      if (fetchedUsers && Array.isArray(fetchedUsers)) {
        const usersData = fetchedUsers.map((user: any) => ({
          id: user.ID,
          username: user.Username,
          fullname: `${user.FirstName} ${user.LastName}`,
          email: user.Email,
          department: user.Department?.DepartmentName || "N/A",
          major: user.Major?.MajorName || "N/A",
          role: user.Role?.RoleName || "N/A",
          status: user.Status,
        }));
        setUsers(usersData);
        setFilteredUsers(usersData); // ตั้งค่า filteredUsers เริ่มต้นให้เท่ากับ users ทั้งหมด
      } else {
        message.error("Failed to load users.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("An error occurred while fetching users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id: string) => {
    if (id === loggedInUserId) {
      message.error("You cannot delete your own account.");
      return;
    }

    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const isDeleted = await DeleteUserByID(Number(id));
          if (isDeleted) {
            message.success("User deleted successfully.");
            fetchUsers();
          } else {
            message.error("Failed to delete the user.");
          }
        } catch (error) {
          message.error("An error occurred while deleting the user.");
        }
      },
      onCancel: () => {
        console.log("Deletion canceled");
      },
    });
  };

  const handleUpdate = async (id: string, status: string) => {
    if (id === loggedInUserId) {
      message.error("You cannot update your own status.");
      return;
    }
    const formData = new FormData();

    formData.append("Status", status);
    console.log("Updating status with:", status);
    try {
      const response = await UpdateUserByid(id, formData);
      if (response) {
        message.success("User status updated successfully.");
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id.toString() === id ? { ...user, status } : user
          )
        );
        setFilteredUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id.toString() === id ? { ...user, status } : user
          )
        );
      } else {
        message.error("Failed to update user status.");
      }
    } catch (error) {
      message.error("An error occurred while updating user status.");
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = users.filter((user) =>
      `${user.username} ${user.fullname} ${user.email} ${user.department} ${user.role}`
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
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
      title: "Major",
      dataIndex: "major",
      key: "major",
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
            onClick={() => handleUpdate(record.id.toString(), "Active")}
            disabled={record.status === "Active" || record.id.toString() === loggedInUserId}
          >
            Activate
          </Button>
          <Button
            type="default"
            danger
            onClick={() => handleUpdate(record.id.toString(), "Inactive")}
            disabled={record.status === "Inactive" || record.id.toString() === loggedInUserId}
          >
            Deactivate
          </Button>
          <Button
            type="default"
            danger
            onClick={() => handleDelete(record.id.toString())}
            disabled={record.id.toString() === loggedInUserId}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const getRowClassName = (record: User) => {
    return record.id.toString() === loggedInUserId ? "highlight-row" : "";
  };

  return (
    <div>
      <Header />
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
      <div className="manage-users-container">
        <h2>Manage Users</h2>
        <Search
          placeholder="Search by username, fullname, email, department, or role"
          enterButton
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={handleSearch}
          style={{ marginBottom: "1rem", width: "400px" }}
        />
        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
          loading={loading}
          bordered
          rowClassName={getRowClassName}
        />
      </div>
    </div>
  );
};

export default ManageUsers;