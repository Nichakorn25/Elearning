import React, { useState } from "react";
import { Modal, Input, Select, DatePicker, TimePicker, Button } from "antd";
import "./Taskpopup.css";

const { TextArea } = Input;
const { Option } = Select;

const Taskpopup = ({ isVisible, onClose, onSubmit }) => {
  const handleSave = () => {
    // ส่งข้อมูลกลับเมื่อกด Save
    onSubmit({
      title: "", // ตัวอย่าง: รับค่าจากช่อง Input Title
      date: null, // ตัวอย่าง: รับค่าจาก DatePicker
      time: null, // ตัวอย่าง: รับค่าจาก TimePicker
      description: "", // ตัวอย่าง: รับค่าจาก TextArea
      category: "งานของฉัน", // ตัวอย่าง: รับค่าจาก Dropdown
    });
    onClose(); // ปิด Popup
  };

  return (
    <Modal
      visible={isVisible}
      onCancel={onClose}
      footer={null} // ซ่อน Footer ของ Ant Design
      className="custom-task-modal"
    >
      {/* Title */}
      <Input
        placeholder="Add title"
        className="title-input"
        style={{ marginBottom: "16px" }}
      />

      {/* Date & Time */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <DatePicker placeholder="Select Date" style={{ flex: 1 }} />
        <TimePicker placeholder="Select Time" style={{ flex: 1 }} format="h:mm a" />
      </div>

      {/* Description */}
      <TextArea
        placeholder="Add description"
        rows={4}
        style={{ marginBottom: "16px" }}
      />

      {/* Dropdown */}
      <Select
        placeholder="งานของฉัน"
        style={{ width: "100%", marginBottom: "16px" }}
      >
        <Option value="mywork">งานของฉัน</Option>
        <Option value="other">อื่นๆ</Option>
      </Select>

      {/* Save Button */}
      <div style={{ textAlign: "right" }}>
        <Button type="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default Taskpopup;
