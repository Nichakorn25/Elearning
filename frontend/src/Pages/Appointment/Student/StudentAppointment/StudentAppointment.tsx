import React, { useState, useEffect } from "react";
import { Table, Button, message } from "antd";
import Swal from "sweetalert2"; // Import SweetAlert2
import Header from "../../../Component/Header/Header";
import "./StudentAppointment.css";

const StudentAppointment: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const studentId = localStorage.getItem("id"); // ดึง studentId จาก localStorage

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);

        // ข้อมูล Dummy สำหรับการทดสอบ
        const dummyData = [
          {
            ID: 1,
            User: {
              Username: "testuser01",
              FirstName: "ณิชากร",
              LastName: "จันทร์ยุทา",
            },
            DayofWeek: { DayName: "Monday" },
            TeacherAppointment: {
              appointment_duration: "10:00 - 11:00",
              title: "Database",
              description: "Learn algebra basics",
              location: "Online",
              Teacher: {
                FirstName: "ศรัญญา",
                LastName: "กาญจนวัฒนา",
              },
            },
          },
          {
            ID: 2,
            User: {
              Username: "testuser02",
              FirstName: "ณิชากร",
              LastName: "จันทร์ยุทา",
            },
            DayofWeek: { DayName: "Wednesday" },
            TeacherAppointment: {
              appointment_duration: "13:00 - 14:00",
              title: "Microprocessor",
              description: "Physics tutoring session",
              location: "Classroom A2",
              Teacher: {
                FirstName: "วิชัย",
                LastName: "ศรีสุรักษ์",
              },
            },
          },
        ];

        setBookings(dummyData);
        console.log("Fetched Bookings (Dummy):", dummyData);
        message.success("Dummy bookings loaded successfully.");
      } catch (error) {
        console.error("Error fetching bookings:", error);
        message.error("Failed to load dummy bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [studentId]);

  const handleDelete = (id: number) => {
    const bookingToRemove = bookings.find((booking) => booking.ID === id);
    if (!bookingToRemove) {
      console.error(`Booking with ID ${id} not found`);
      return;
    }

    const teacherName = `${bookingToRemove.TeacherAppointment?.Teacher?.FirstName || ""} ${bookingToRemove.TeacherAppointment?.Teacher?.LastName || ""}`;

    Swal.fire({
      title: "Are you sure?",
      text: `คุณต้องการลบนัดหมายกับ "${teacherName}" ใช่ไหม`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#45B39D",
      cancelButtonColor: "#CD6155",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        setBookings((prev) => prev.filter((booking) => booking.ID !== id));
        Swal.fire(
          "Deleted!",
          `นัดหมายกับ "${teacherName}" ได้ถูกลบออกเรียบร้อยแล้ว`,
          "success"
        );
      }
    });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: ["TeacherAppointment", "title"],
      key: "title",
    },
    {
      title: "Teacher",
      key: "teacher",
      render: (_: any, record: any) =>
        `${record.TeacherAppointment?.Teacher?.FirstName || "Unknown"} ${
          record.TeacherAppointment?.Teacher?.LastName || ""
        }`,
    },
    {
      title: "Duration",
      dataIndex: ["TeacherAppointment", "appointment_duration"],
      key: "appointment_duration",
    },
    {
      title: "Location",
      dataIndex: ["TeacherAppointment", "location"],
      key: "location",
    },
    {
      title: "Description",
      dataIndex: ["TeacherAppointment", "description"],
      key: "description",
    },
    {
      title: "Day",
      dataIndex: ["DayofWeek", "DayName"],
      key: "day",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div>
          <Button type="primary" danger onClick={() => handleDelete(record.ID)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="StudentAppointment-layout">
      <Header />
      <h1 className="table-header">Student Appointments</h1>
      <Table
        dataSource={bookings}
        columns={columns}
        rowKey={(record) => record.ID.toString()}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default StudentAppointment;
