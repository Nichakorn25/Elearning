import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Radio, Checkbox, Button } from "antd";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface CreateAppointmentPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

const CreateAppointmentPopup: React.FC<CreateAppointmentPopupProps> = ({
  isVisible,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit(values); // ส่งค่ากลับไปยังไฟล์หลัก
    form.resetFields(); // รีเซ็ตฟอร์มหลังจากส่งข้อมูล
    onClose(); // ปิด Popup
  };

  return (
    <Modal
      title="Create Appointment Schedule"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        {/* Appointment Title */}
        <Form.Item
          label="Appointment Title"
          name="title"
          rules={[{ required: true, message: "Please input the appointment title!" }]}
        >
          <Input placeholder="Enter title (e.g., Consultation)" />
        </Form.Item>

        {/* Date and Time Range */}
        <Form.Item
          label="Date and Time Range"
          name="dateTimeRange"
          rules={[{ required: true, message: "Please select date and time range!" }]}
        >
          <RangePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: "100%" }} />
        </Form.Item>

        {/* Duration */}
        <Form.Item
          label="Duration of Each Appointment (Minutes)"
          name="duration"
          rules={[{ required: true, message: "Please select the duration!" }]}
        >
          <Select placeholder="Select duration">
            {[15, 30, 45, 60].map((d) => (
              <Option key={d} value={d}>{`${d} minutes`}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Repeat Schedule */}
        <Form.Item label="Repeat Schedule" name="repeat">
          <Radio.Group>
            <Radio value="none">No Repeat</Radio>
            <Radio value="daily">Daily</Radio>
            <Radio value="weekly">Weekly</Radio>
          </Radio.Group>
        </Form.Item>

        {/* Buffer Time */}
        <Form.Item label="Buffer Time Between Appointments (Minutes)" name="bufferTime">
          <Select placeholder="Select buffer time">
            {[0, 10, 15, 30].map((buffer) => (
              <Option key={buffer} value={buffer}>{`${buffer} minutes`}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Location */}
        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Please input the location!" }]}
        >
          <Input placeholder="Enter location (e.g., Onsite, Google Meet)" />
        </Form.Item>

        {/* Notes */}
        <Form.Item label="Description / Notes" name="notes">
          <Input.TextArea rows={4} placeholder="Additional notes or description about the appointment" />
        </Form.Item>

        {/* Confirmation Email Checkbox */}
        <Form.Item name="confirmationEmail" valuePropName="checked">
          <Checkbox>Require email confirmation</Checkbox>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create Appointment Schedule
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAppointmentPopup;
