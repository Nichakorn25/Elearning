import React, { useState, useEffect } from "react";
import { Modal, Input, Select, DatePicker, TimePicker, Button } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "./Taskpopup.css";

const { TextArea } = Input;
const { Option } = Select;

interface TaskPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (values: {
    title: string;
    date: Dayjs | null;
    time: Dayjs | null;
    description: string;
    category: string;
  }) => void;
  selectedDate?: string | null;
}

const TaskPopup: React.FC<TaskPopupProps> = ({
  isVisible,
  onClose,
  onSubmit,
  selectedDate,
}) => {
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<Dayjs | null>(null); // รองรับ Dayjs | null
  const [time, setTime] = useState<Dayjs | null>(null); // รองรับ Dayjs | null
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("งานของฉัน");

  useEffect(() => {
    if (selectedDate) {
      setDate(dayjs(selectedDate)); // แปลง selectedDate เป็น Dayjs
    }
  }, [selectedDate]);

  const handleSave = () => {
    onSubmit({
      title,
      date,
      time,
      description,
      category,
    });
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      className="custom-task-modal"
    >
      <Input
        placeholder="Add title"
        className="title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: "16px" }}
      />
      <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
        <DatePicker
          placeholder="Select Date"
          value={date}
          onChange={(value) => setDate(value)} // รับค่าเป็น Dayjs
          style={{ flex: 1 }}
        />
        <TimePicker
          placeholder="Select Time"
          value={time}
          onChange={(value) => setTime(value)} // รับค่าเป็น Dayjs
          style={{ flex: 1 }}
          format="h:mm a"
        />
      </div>
      <TextArea
        placeholder="Add description"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ marginBottom: "16px" }}
      />
      <Select
        placeholder="งานของฉัน"
        value={category}
        onChange={(value) => setCategory(value)}
        style={{ width: "100%", marginBottom: "16px" }}
      >
        <Option value="mywork">งานของฉัน</Option>
        <Option value="otherwork">งานอื่นๆ</Option>
      </Select>
      <div style={{ textAlign: "right" }}>
        <Button type="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default TaskPopup;
