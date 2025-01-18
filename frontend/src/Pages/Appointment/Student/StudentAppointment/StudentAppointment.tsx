import React, { useState, useEffect } from "react";
import { Table, Button, message } from "antd";
import { GetStudentBookingsByID, DeleteStudentBookingByID } from "../../../../services/https";
import Header from "../../../Component/Header/Header";
import { StudentBookingInterface } from "../../../../Interface/IAppointment";
import "./StudentAppointment.css"; // นำเข้า CSS

const StudentAppointment: React.FC = () => {
  const [bookings, setBookings] = useState<StudentBookingInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const studentId = localStorage.getItem("id");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
  
        if (!studentId) {
          message.error("Student ID not found.");
          return;
        }
  
        const response = await GetStudentBookingsByID(studentId);
  
        // ตรวจสอบโครงสร้างข้อมูลที่ได้จาก API
        console.log("API Response:", response.data);
  
        if (response?.status === 200) {
          // ตรวจสอบว่า data เป็น array หรือไม่
          const data = Array.isArray(response.data) ? response.data : [];
          setBookings(data);
          message.success("Bookings loaded successfully.");
        } else {
          message.error("Failed to fetch bookings.");
        }
      } catch (error) {
        message.error("Failed to fetch bookings.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBookings();
  }, [studentId]);
  

  const handleDelete = async (bookingId: number) => {
    try {
      const response = await DeleteStudentBookingByID(bookingId);
      if (response?.status === 200) {
        setBookings((prev) => prev.filter((booking) => booking.ID !== bookingId));
        message.success("Booking deleted successfully.");
      } else {
        message.error("Failed to delete booking.");
      }
    } catch (error) {
      message.error("Failed to delete booking.");
      console.error(error);
    }
  };

  const columns = [
    {
      title: "Appointment Title",
      dataIndex: "title",
      key: "appointment",
    },
    {
      title: "Day",
      dataIndex: "dayName",
      key: "day",
    },
    {
      title: "Teacher",
      dataIndex: "teacherName",
      key: "teacher",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Button type="primary" danger onClick={() => handleDelete(record.ID)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="StudentAppointment-layout">
      <Header />
      <h1 className="table-header">Student Bookings</h1>
      <Table
        dataSource={bookings}
        columns={columns}
        rowKey={(record) => record.ID!.toString()}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default StudentAppointment;
