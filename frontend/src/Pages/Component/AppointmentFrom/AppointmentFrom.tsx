import React from "react";
import { Modal, Form, Input, DatePicker, Select, Button } from "antd";
import type { Dayjs } from "dayjs";

const { Option } = Select;

interface AppointmentModalProps {
  visible: boolean; // สถานะเปิด/ปิด Modal
  onClose: () => void; // ฟังก์ชันปิด Modal
  selectedDate: Dayjs | null; // วันที่ที่เลือก
  onSubmit: (values: any) => void; // ฟังก์ชันจัดการเมื่อบันทึกฟอร์ม
}

const AppointmentFrom: React.FC<AppointmentModalProps> = ({
  visible,
  onClose,
  selectedDate,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="New Appointment"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onSubmit(values);
          form.resetFields(); // ล้างข้อมูลในฟอร์ม
        }}
      >
        <Form.Item
          label="Event Title"
          name="title"
          rules={[{ required: true, message: "Please enter the event title!" }]}
        >
          <Input placeholder="Enter event title" />
        </Form.Item>
        <Form.Item
          label="Date"
          name="date"
          initialValue={selectedDate}
          rules={[{ required: true, message: "Please select a date!" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            defaultValue={selectedDate}
            format="DD-MM-YYYY"
            disabled
          />
        </Form.Item>
        <Form.Item
          label="Type of Event"
          name="eventType"
          rules={[{ required: true, message: "Please select event type!" }]}
        >
          <Select placeholder="Select event type">
            <Option value="user">User</Option>
            <Option value="meeting">Meeting</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>
        <div style={{ textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: "10px" }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AppointmentFrom;
