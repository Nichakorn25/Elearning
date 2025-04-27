import React, { useState, useEffect } from "react";
import { Table, Button, message } from "antd";
import Swal from "sweetalert2";
import { GetStudentBookingsByID } from "../../../../services/https";
import Header from "../../../Component/Header/Header";

const StudentAppointment: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const studentId = localStorage.getItem("id");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        if (!studentId) {
          throw new Error("Student ID not found in localStorage");
        }

        const data = await GetStudentBookingsByID(studentId);

        if (Array.isArray(data)) {
          const formattedData = data.map((item) => ({
            ...item,
            teacher_name: `${item.teacher_first_name} ${item.teacher_last_name}`, // รวมชื่ออาจารย์
          }));
          setBookings(formattedData);
          message.success("โหลดข้อมูลการนัดหมายสำเร็จ");
        } else {
          throw new Error("ข้อมูลไม่ถูกต้อง");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        message.error("ไม่มีข้อมูลการนัดหมาย");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [studentId]);

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Teacher", dataIndex: "teacher_name", key: "teacher_name" },
    { title: "Duration", dataIndex: "appointment_duration", key: "appointment_duration" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Created At", dataIndex: "created_at", key: "created_at" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Button type="primary" danger onClick={() => handleDelete(record.booking_id)}>
          Delete
        </Button>
      ),
    },
  ];

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: `คุณต้องการลบนัดหมายนี้ใช่ไหม?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#45B39D",
      cancelButtonColor: "#CD6155",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        setBookings((prev) => prev.filter((booking) => booking.booking_id !== id));
        Swal.fire("Deleted!", "นัดหมายถูกลบเรียบร้อยแล้ว", "success");
      }
    });
  };

  return (
    <div className="StudentAppointment-layout">
      <Header/>
      <h1 className="table-header">Student Appointments</h1>
      <Table
        dataSource={bookings}
        columns={columns}
        rowKey={(record) => record.booking_id.toString()}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>

    
  );
};

export default StudentAppointment;