// import React, { useState, useEffect } from "react";
// import { Table, Button, message } from "antd";
// import Swal from "sweetalert2"; // Import SweetAlert2
// import Header from "../../../Component/Header/Header";
// import "./StudentAppointment.css";
// import { GetStudentBookingsByID } from "../../../../services/https"; // Import service API

// const StudentAppointment: React.FC = () => {
//   const [bookings, setBookings] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const studentId = localStorage.getItem("id"); // ดึง studentId จาก localStorage

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         setLoading(true);

//         // เรียก API เพื่อนำข้อมูลการนัดหมาย
//         if (!studentId) {
//           throw new Error("Student ID not found in localStorage");
//         }

//         const response = await GetStudentBookingsByID(studentId);
//         console.log(response);

//         if (response && response.status === 200) {
//           setBookings(response.data); // อัปเดต state bookings ด้วยข้อมูลจาก API
//           console.log(response)
//           message.success("โหลดข้อมูลการนัดหมายสำเร็จ");
//         } else {
//           throw new Error("ไม่สามารถดึงข้อมูลการนัดหมายได้");
//         }
//       } catch (error) {
//         console.error("Error fetching bookings:", error);
//         message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [studentId]);

//   const handleDelete = (id: number) => {
//     const bookingToRemove = bookings.find((booking) => booking.ID === id);
//     if (!bookingToRemove) {
//       console.error(`Booking with ID ${id} not found`);
//       return;
//     }

//     const teacherName = `${bookingToRemove.TeacherAppointment?.Teacher?.FirstName || ""} ${bookingToRemove.TeacherAppointment?.Teacher?.LastName || ""}`;

//     Swal.fire({
//       title: "Are you sure?",
//       text: `คุณต้องการลบนัดหมายกับ "${teacherName}" ใช่ไหม?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#45B39D",
//       cancelButtonColor: "#CD6155",
//       confirmButtonText: "Yes",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // หากมี API สำหรับลบนัดหมาย ให้เรียกใช้ที่นี่ เช่น DeleteBooking(id)
//         setBookings((prev) => prev.filter((booking) => booking.ID !== id));
//         Swal.fire(
//           "Deleted!",
//           `นัดหมายกับ "${teacherName}" ได้ถูกลบออกเรียบร้อยแล้ว`,
//           "success"
//         );
//       }
//     });
//   };

//   const columns = [
//     {
//       title: "Title",
//       dataIndex: ["TeacherAppointment", "title"],
//       key: "title",
//     },
//     {
//       title: "Teacher",
//       key: "teacher",
//       render: (_: any, record: any) =>
//         `${record.TeacherAppointment?.Teacher?.FirstName || "Unknown"} ${
//           record.TeacherAppointment?.Teacher?.LastName || ""
//         }`,
//     },
//     {
//       title: "Duration",
//       dataIndex: ["TeacherAppointment", "appointment_duration"],
//       key: "appointment_duration",
//     },
//     {
//       title: "Location",
//       dataIndex: ["TeacherAppointment", "location"],
//       key: "location",
//     },
//     {
//       title: "Description",
//       dataIndex: ["TeacherAppointment", "description"],
//       key: "description",
//     },
//     {
//       title: "Day",
//       dataIndex: ["DayofWeek", "DayName"],
//       key: "day",
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_: any, record: any) => (
//         <div>
//           <Button type="primary" danger onClick={() => handleDelete(record.ID)}>
//             Delete
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="StudentAppointment-layout">
//       <Header />
//       <h1 className="table-header">Student Appointments</h1>
//       <Table
//         dataSource={bookings}
//         columns={columns}
//         rowKey={(record) => record.ID.toString()}
//         loading={loading}
//         pagination={{ pageSize: 10 }}
//       />
//     </div>
//   );
// };

// export default StudentAppointment;

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
        message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
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
