import React, { useState,useEffect } from "react";
import { Modal, Input, Select, DatePicker, TimePicker, Button } from "antd";
import "./Taskpopup.css";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

const Taskpopup = ({ isVisible, onClose, onSubmit , selectedDate }) => {
  // สร้าง state สำหรับเก็บค่าจากฟอร์ม
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("งานของฉัน");

  useEffect(() => {
    if (selectedDate) {
      setDate(dayjs(selectedDate)); // อัปเดตวันที่เมื่อ selectedDate เปลี่ยน
    }
  }, [selectedDate]);

  const handleSave = () => {
    // ส่งข้อมูลกลับเมื่อกด Save
    onSubmit({
      title, // ค่า Title
      date, // ค่า Date
      time, // ค่า Time
      description, // ค่า Description
      category, // ค่า Category
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
        value={title}
        onChange={(e) => setTitle(e.target.value)} // อัปเดตค่า title
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
        <DatePicker
          placeholder="Select Date"
          value={date}
          onChange={(value) => setDate(value)} // อัปเดตค่า date
          style={{ flex: 1 }}
        />
        <TimePicker
          placeholder="Select Time"
          value={time}
          onChange={(value) => setTime(value)} // อัปเดตค่า time
          style={{ flex: 1 }}
          format="h:mm a"
        />
      </div>

      {/* Description */}
      <TextArea
        placeholder="Add description"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)} // อัปเดตค่า description
        style={{ marginBottom: "16px" }}
      />

      {/* Dropdown */}
      <Select
        placeholder="งานของฉัน"
        value={category}
        onChange={(value) => setCategory(value)} // อัปเดตค่า category
        style={{ width: "100%", marginBottom: "16px" }}
      >
        <Option value="mywork">งานของฉัน</Option>
        <Option value="otherwork">งานอื่นๆ</Option>
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
