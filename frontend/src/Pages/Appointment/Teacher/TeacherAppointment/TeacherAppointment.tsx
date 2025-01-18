import React, { useState, useEffect } from "react";
import { Table, Button, message } from "antd";
import { GetTeacherAppointments, DeleteTeacherAppointmentByID } from "../../../../services/https"; // Import ฟังก์ชันลบ
import Header from "../../../Component/Header/Header";
import { TeacherAppointmentInterface } from "../../../../Interface/IAppointment";
import "./TeacherAppointment.css";

const TeacherAppointment: React.FC = () => {
  const [appointments, setAppointments] = useState<TeacherAppointmentInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);

        if (!userId) {
          message.error("User ID not found.");
          return;
        }

        const response = await GetTeacherAppointments(userId);
        if (response?.status === 200) {
          setAppointments(response.data || []);
          message.success("Appointments loaded successfully.");
        } else {
          message.error(`Failed to fetch appointments: ${response?.data?.message}`);
        }
      } catch (error) {
        message.error("Failed to fetch appointments.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId]);

  const handleDelete = async (appointmentId: number) => {
    try {
      const response = await DeleteTeacherAppointmentByID(appointmentId);
      if (response?.status === 200) {
        setAppointments((prev) => prev.filter((appointment) => appointment.ID !== appointmentId));
        message.success("Appointment deleted successfully.");
      } else {
        message.error("Failed to delete appointment.");
      }
    } catch (error) {
      message.error("Failed to delete appointment.");
      console.error(error);
    }
  };
  

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Duration (mins)",
      dataIndex: "appointment_duration",
      key: "appointment_duration",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Description",
      dataIndex: "description",
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
      render: (_: any, record: TeacherAppointmentInterface) => (
        <div>
          <Button type="primary" danger onClick={() => handleDelete(record.ID!)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="TeacherAppointment-layout">
      <Header />
      <h1 className="table-header">Teacher Appointments</h1>
      <Table
        dataSource={appointments}
        columns={columns}
        rowKey={(record) => record.ID!.toString()}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default TeacherAppointment;
